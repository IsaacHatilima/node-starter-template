import {PrismaClient} from "../../../generated/prisma/client";

export class MeService {
    constructor(private db: PrismaClient) {
    }

    async getMe(id: string) {
        const user = await this.db.user.findUnique({
            where: {id},
            include: {profile: true},
            omit: {password: true}
        });

        if (!user) throw new Error("USER_NOT_FOUND");

        return user;
    }
}