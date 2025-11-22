import {Request, Response} from "express";
import {container} from "../../lib/container";

export default async function LogoutController(req: Request, res: Response) {

    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
        return res.status(200).json({message: "Logged out"});
    }

    await container.logoutService.logout(refreshToken);

    // Remove cookie
    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.APP_ENV === "production",
        sameSite: "strict",
        path: "/auth"
    });


    return res.json({message: "Logged out."});
}
