import "dotenv/config";
import jwt from "jsonwebtoken";
import {env} from "../utils/environment-variables";
import ms from "ms";
import {randomUUID} from "crypto";

const accessSecret = env.JWT_ACCESS_SECRET;
const refreshSecret = env.JWT_REFRESH_SECRET;
const accessExpires = ms(env.JWT_ACCESS_EXPIRES_IN as ms.StringValue);
const refreshExpires = ms(env.JWT_REFRESH_EXPIRES_IN as ms.StringValue);


export function generateAccessToken(payload: { id: number; email: string; }) {
    return jwt.sign({
        ...payload,
    }, accessSecret, {expiresIn: accessExpires});
}

export function generateRefreshToken({id}: { id: number; }) {
    return jwt.sign({
        id,
        jti: randomUUID(),
    }, refreshSecret, {expiresIn: refreshExpires});
}
