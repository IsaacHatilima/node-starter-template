import "dotenv/config";
import {container} from "../../lib/container";
import {Request, Response} from "express";
import {setAuthCookies} from "../../lib/set-auth-cookies";

export default async function RefreshTokenController(req: Request, res: Response) {
    try {
        const refreshToken = req.cookies?.refresh_token as string;
        if (!refreshToken) {
            return res.status(401).json({errors: ["No refresh token"]});
        }
        const tokens = await container.refreshTokenService.refresh(refreshToken);

        setAuthCookies(res, {
            refresh: tokens.refresh_token!,
            access: tokens.access_token!,
        });

        return res.json({
            message: "Token refreshed",
        });
    } catch (error: any) {
        if (error.message === "INVALID_OR_EXPIRED_REFRESH_TOKEN") {
            return res.status(401).json({errors: ["Invalid or expired refresh token"]});
        }
        return res.status(500).json({
            error: error.message,
            stack: error.stack,
        });
        //return res.status(500).json({errors: ["Something went wrong"]});
    }
}
