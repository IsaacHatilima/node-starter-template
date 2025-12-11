import {container} from "../../lib/container";
import {Request, Response} from "express";

export default async function VerifyEmailController(req: Request, res: Response) {
    try {
        const {token} = req.query as { token: string };
        if (!token) {
            return res.status(422).json({errors: ["Verification token missing"]});
        }
        await container.emailVerificationService.verifyEmail(token);
        return res.json({
            message: "Email successfully verified."
        });
    } catch (error: any) {
        const msg = error.message;
        if (msg === "INVALID_OR_EXPIRED_TOKEN")
            return res.status(400).json({errors: ["Invalid or expired token"]});
        if (msg === "ALREADY_VERIFIED")
            return res.status(400).json({errors: ["Email already verified"]});
        if (msg === "USER_NOT_FOUND")
            return res.status(404).json({errors: ["User not found"]});
        return res.status(500).json({error: "Something went wrong"});
    }
}
