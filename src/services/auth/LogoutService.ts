import {PrismaClient} from "../../../generated/prisma/client";

export class LogoutService {
    constructor(private db: PrismaClient) {
    }

    async logout(refreshToken: string) {
        const stored = await this.db.refreshToken.findUnique({
            where: {token: refreshToken}
        });

        if (stored) {
            await this.db.refreshToken.update({
                where: {token: refreshToken},
                data: {revoked: true}
            });
        }

        return true;
    }
}
