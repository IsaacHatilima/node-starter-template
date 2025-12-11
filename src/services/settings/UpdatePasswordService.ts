import {prisma} from "../../config/db";
import bcrypt from "bcrypt";
import {Request} from "express";

export class UpdatePasswordService {
    async updatePassword(data: { current_password: string; password: string }, reqUser: Request) {
        const user = await prisma.user.findFirst({
            where: {id: reqUser.user.id},
        });
        const valid = await bcrypt.compare(data.current_password, user!.password);
        if (!valid) {
            throw new Error("INVALID_PASSWORD");
        }
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            await prisma.user.update({
                where: {id: reqUser.user.id},
                data: {password: hashedPassword},
            });
            return {success: true};
        } catch (error) {
            throw error;
        }
    }
}
