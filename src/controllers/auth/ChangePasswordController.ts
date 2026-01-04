import {container} from "../../lib/container";
import {NextFunction, Request, Response} from "express";
import {fail, success} from "../../lib/response";
import {passwordChangeSchema} from "../../schemas/auth";
import {ChangePasswordRequestDTO} from "../../dtos/command/ChangePasswordRequestDTO";

export default async function ChangePasswordController(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = passwordChangeSchema.safeParse(req.body);
        if (!parsed.success) {
            return fail(res, {
                status: 422,
                errors: parsed.error.issues.map((i) => i.message),
            });
        }
        const token = req.query.token as string;
        if (!token) {
            return fail(res, {message: "Invalid or expired token"});
        }

        const dto = ChangePasswordRequestDTO.fromParsed({
            ...parsed.data,
            token: token,
        });

        await container.changePasswordService.changePassword(dto);
        return success(res, {
            message: "Password changed successfully.",
        });
    } catch (error: any) {
        next(error);
    }
}
