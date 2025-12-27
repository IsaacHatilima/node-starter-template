import {prisma} from "../../config/db";
import jwt from "jsonwebtoken";
import {generateAccessToken, generateRefreshToken} from "../../lib/jwt";
import {env} from "../../utils/environment-variables";
import {AppError, InvalidRefreshTokenError} from "../../lib/errors";
import {redis} from "../../config/redis";

export class RefreshTokenService {
    async refresh(refreshToken: string) {
        let decoded: { id: number };

        try {
            decoded = jwt.verify(
                refreshToken,
                env.JWT_REFRESH_SECRET
            ) as { id: number };
        } catch {
            throw new InvalidRefreshTokenError();
        }

        const stored = await prisma.refreshToken.findUnique({
            where: {token: refreshToken},
        });

        if (
            !stored ||
            stored.revoked ||
            stored.userId !== decoded.id ||
            stored.expiresAt < new Date()
        ) {
            throw new InvalidRefreshTokenError();
        }

        const user = await prisma.user.findUnique({
            where: {id: stored.userId},
            select: {id: true, email: true},
        });

        if (!user) {
            throw new InvalidRefreshTokenError();
        }

        const newRefresh = generateRefreshToken({id: stored.userId});
        const newAccess = generateAccessToken({
            id: stored.userId,
            email: user.email,
        });

        try {
            await prisma.$transaction([
                prisma.refreshToken.update({
                    where: {token: refreshToken},
                    data: {revoked: true},
                }),
                prisma.refreshToken.create({
                    data: {
                        userId: stored.userId,
                        token: newRefresh,
                        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
                    },
                }),
            ]);

            await redis.del(`user:${stored.userId}`);
        } catch (e) {
            console.error("Failed to update refresh tokens", e);
            throw new AppError("Failed to update refresh tokens");
        }

        return {
            access_token: newAccess,
            refresh_token: newRefresh,
        };
    }

}
