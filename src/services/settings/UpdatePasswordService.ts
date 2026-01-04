import {prisma} from "../../config/db";
import bcrypt from "bcrypt";
import {Request} from "express";
import {InvalidPasswordError, UpdatePasswordError, UserNotFoundError} from "../../lib/errors";
import {UpdatePasswordRequestDTO} from "../../dtos/command/UpdatePasswordRequestDTO";

export class UpdatePasswordService {
    async updatePassword(dto: UpdatePasswordRequestDTO, reqUser: Request) {
        const user = await prisma.user.findUnique({
            where: {public_id: reqUser.user.public_id},
        });

        if (!user) throw new UserNotFoundError();

        const valid = await bcrypt.compare(dto.current_password, user.password);
        if (!valid) {
            throw new InvalidPasswordError();
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        try {
            await prisma.user.update({
                where: {id: user.id},
                data: {password: hashedPassword},
            });
        } catch {
            throw new UpdatePasswordError();
        }

        return {ok: true};
    }
}
