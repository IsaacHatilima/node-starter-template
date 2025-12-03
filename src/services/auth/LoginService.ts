import {prisma} from "../../config/db";
import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken} from "../../lib/jwt";
import jwt, {JwtPayload} from "jsonwebtoken";
import {redis} from "../../config/redis";

export class LoginService {
    async login(data: {
        email: string;
        password: string;
    }) {
        const user = await prisma.user.findFirst({
            where: {email: data.email},
            include: {profile: true},
        });

        if (!user) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const valid = await bcrypt.compare(data.password, user.password);

        if (!valid) {
            throw new Error("INVALID_CREDENTIALS");
        }

        delete (user as any).password;

        const access_token = generateAccessToken({
            id: user.id,
            email: user.email,
        });

        const refresh_token = generateRefreshToken({
            id: user.id,
        });

        const decoded = jwt.decode(access_token) as JwtPayload & { jti?: string };
        const jti = decoded.jti as string;


        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                jti,
                token: refresh_token,
                expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000)
            }
        });

        await prisma.user.update({
            where: {email: data.email},
            data: {last_login: new Date()}
        });

        await redis.multi()
            .setEx(
                `session:${jti}`,
                60 * 5,
                JSON.stringify({
                    userId: user.id,
                    jti,
                })
            )
            .setEx(
                `user:${user.id}`,
                60 * 5,
                JSON.stringify(user)
            )
            .exec();


        return {
            user,
            access_token,
            refresh_token,
        };
    }
}


