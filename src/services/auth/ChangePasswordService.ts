import bcrypt from "bcrypt";
import {prisma} from "../../config/db";
import {AppError, InvalidPasswordTokenError, UserNotFoundError} from "../../lib/errors";
import {ChangePasswordRequestDTO} from "../../dtos/command/ChangePasswordRequestDTO";

export class ChangePasswordService {
    async changePassword(dto: ChangePasswordRequestDTO) {
        const passwordToken = await prisma.passwordResetToken.findUnique({
            where: {token: dto.token}
        });
        if (!passwordToken) {
            throw new InvalidPasswordTokenError();
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        try {
            await prisma.user.update({
                where: {id: passwordToken.userId},
                data: {password: hashedPassword},
            });
        } catch (error: any) {
            if (error.code === "P2025") {
                throw new UserNotFoundError();
            }
            throw new AppError("Internal server error");
        }

        try {
            await prisma.passwordResetToken.delete({
                where: {token: dto.token},
            });
        } catch (error: any) {
            if (error.code === "P2025") {
                throw new InvalidPasswordTokenError();
            }
            throw new AppError("Internal server error");
        }
        return;
    }
}
