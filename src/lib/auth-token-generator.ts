import {generateAccessToken, generateRefreshToken} from "./jwt";
import {prisma} from "../config/db";
import {env} from "../utils/environment-variables";
import ms from "ms";

export async function generateAuthToken({id, email}: { id: number; email: string; }) {
    const access_token = generateAccessToken({id: id, email: email});
    const refresh_token = generateRefreshToken({id: id});
    const refreshExpiryMs = ms(env.JWT_REFRESH_EXPIRES_IN as ms.StringValue);

    await prisma.refreshToken.create({
        data: {
            userId: id,
            token: refresh_token,
            expiresAt: new Date(Date.now() + refreshExpiryMs),
        },
    });
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
    };
}
