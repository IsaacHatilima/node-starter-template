import { prisma } from "../../config/db.js";
import { normalizeEmail, normalizeName } from "../../utils/string.js";
import { redis } from "../../config/redis.js";
import { toSafeUser } from "../../lib/safe-user.js";
export class UpdateProfileService {
    async updateProfile(data, reqUser) {
        const emailChanged = data.email !== reqUser.email;
        try {
            const updatedUser = await prisma.user.update({
                where: { id: reqUser.id },
                data: {
                    email: normalizeEmail(data.email),
                    ...(emailChanged && { email_verified_at: null }),
                    profile: {
                        update: {
                            first_name: normalizeName(data.first_name),
                            last_name: normalizeName(data.last_name),
                        },
                    },
                },
                include: {
                    profile: true,
                },
            });
            await redis.setEx(`user:${updatedUser.id}`, 60 * 5, JSON.stringify(toSafeUser(updatedUser)));
            return { success: true };
        }
        catch (error) {
            if (error.code === "P2025") {
                throw new Error("USER_NOT_FOUND");
            }
            throw error;
        }
    }
}
