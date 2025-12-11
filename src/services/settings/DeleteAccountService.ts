import {prisma} from "../../config/db";
import bcrypt from "bcrypt";
import {redis} from "../../config/redis";
import {Request} from "express";

export class DeleteAccountService {
    async deleteAccount(data: { password: string }, reqUser: Request) {
        const user = await prisma.user.findFirst({
            where: {id: reqUser.user.id},
        });
        const valid = await bcrypt.compare(data.password, user!.password);
        if (!valid) {
            throw new Error("INVALID_PASSWORD");
        }
        const jtiRecord = await prisma.refreshToken.findFirst({
            where: {
                userId: reqUser.user.id,
                revoked: false
            }
        });
        await redis
            .multi()
            .del(`session:${jtiRecord!.jti}`)
            .del(`user:${reqUser.user.id}`)
            .exec();
        try {
            await prisma.user.delete({
                where: {id: reqUser.user.id},
            });
            return {success: true};
        } catch (error) {
            throw error;
        }
    }
}
