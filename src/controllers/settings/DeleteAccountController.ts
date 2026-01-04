import {container} from "../../lib/container";
import {NextFunction, Request, Response} from "express";
import {clearAuthCookies} from "../../lib/auth-cookies";
import {deleted, fail} from "../../lib/response";
import {deleteAccountSchema} from "../../schemas/settings";
import {DeleteAccountRequestDTO} from "../../dtos/command/DeleteAccountRequestDTO";

export default async function DeleteAccountController(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = deleteAccountSchema.safeParse(req.body);

        if (!parsed.success) {
            return fail(res, {
                status: 422,
                errors: parsed.error.issues.map((i) => i.message),
            });
        }

        const dto = DeleteAccountRequestDTO.fromParsed(parsed.data);

        await container.deleteAccountService.deleteAccount(dto, req);

        clearAuthCookies(res);

        return deleted(res);
    } catch (error: any) {
        next(error);
    }
}
