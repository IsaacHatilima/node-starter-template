import {Request, Response} from "express";
import {container} from "../../lib/container";

interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

export default async function MeController(req: AuthRequest, res: Response) {
    try {
        const user = await container.meService.getMe(req.user!.id);

        return res.json({user});

    } catch (error: unknown) {

        if (error instanceof Error && error.message === "USER_NOT_FOUND") {
            return res.status(404).json({
                errors: ["User not found"]
            });
        }
        
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
}
