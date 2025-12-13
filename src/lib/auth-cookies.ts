import {env} from "../utils/environment-variables";
import {Response} from "express";
import ms from "ms";

export function setAuthCookies(res: Response, tokens: { refresh: string; access: string; }) {
    const isProduction = env.NODE_ENV === "production";
    const refreshMaxAge = ms(env.JWT_REFRESH_EXPIRES_IN as ms.StringValue);
    const accessMaxAge = ms(env.JWT_ACCESS_EXPIRES_IN as ms.StringValue);
    res.cookie("refresh_token", tokens.refresh, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        path: "/auth",
        maxAge: refreshMaxAge,
    });
    res.cookie("access_token", tokens.access, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: accessMaxAge,
    });
}

export function clearAuthCookies(res: Response) {
    const isProduction = env.NODE_ENV === "production";

    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/auth",
    });

    res.clearCookie("access_token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
    });
}
