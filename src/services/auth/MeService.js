import { prisma } from "../../config/db.js";
import { toSafeUser } from "../../lib/safe-user.js";
export class MeService {
    async getMe(id) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { profile: true },
        });
        if (!user)
            throw new Error("USER_NOT_FOUND");
        return toSafeUser(user);
    }
}
