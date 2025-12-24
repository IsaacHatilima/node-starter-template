import {generateAccessToken, generateRefreshToken} from "./jwt";
import {prisma} from "../config/db";

export async function generateAuthToken({id, email}: { id: string; email: string; }) {
    const access_token = generateAccessToken({id: id, email: email});
    const refresh_token = generateRefreshToken({id: id});
    await prisma.refreshToken.create({
        data: {
            userId: id,
            token: refresh_token,
            expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        },
    });
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
    };
}
