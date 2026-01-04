import {prisma} from "../../config/db";
import {redis} from "../../config/redis";
import {UserDTO} from "../../dtos/read/UserReadDTO";
import {Request} from "express";
import {EmailTakenError, UpdateProfileError, UserNotFoundError} from "../../lib/errors";
import {UpdateProfileRequestDTO} from "../../dtos/command/UpdateProfileRequestDTO";

export class UpdateProfileService {
    async updateProfile(
        dto: UpdateProfileRequestDTO,
        reqUser: Request
    ) {
        const emailChanged = dto.email !== reqUser.user.email;

        let updatedUser;

        try {
            updatedUser = await prisma.user.update({
                where: {public_id: reqUser.user.public_id},
                data: {
                    email: dto.email,
                    ...(emailChanged && {email_verified_at: null}),
                    profile: {
                        update: {
                            first_name: dto.first_name,
                            last_name: dto.last_name,
                        },
                    },
                },
                include: {profile: true},
            });
        } catch (error: any) {
            if (error.code === "P2025") {
                throw new UserNotFoundError();
            }

            if (error.code === "P2002") {
                throw new EmailTakenError();
            }

            throw new UpdateProfileError();
        }

        try {
            await redis.setEx(
                `user:${updatedUser.id}`,
                60 * 5,
                JSON.stringify(new UserDTO(updatedUser))
            );
        } catch {

        }

        return;
    }

}
