import {container} from "../../lib/container";
import {NextFunction, Request, Response} from "express";
import {fail, success} from "../../lib/response";
import {passwordUpdateSchema} from "../../schemas/settings";
import {UpdatePasswordRequestDTO} from "../../dtos/command/UpdatePasswordRequestDTO";

export default async function UpdatePasswordController(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = passwordUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return fail(res, {
                status: 422,
                errors: parsed.error.issues.map((i) => i.message),
            });
        }

        const dto = UpdatePasswordRequestDTO.fromParsed(parsed.data);
        await container.updatePasswordService.updatePassword(dto, req);
        return success(res, {
            message: "Password changed successfully.",
        });
    } catch (error: any) {
        next(error);
    }
}
