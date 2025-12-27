import {Profile, User} from "../generated/prisma/client";

declare global {
    namespace Express {
        interface Request {
            user: Omit<User, "id" | "password" | "two_factor_secret" | "two_factor_recovery_codes"> & {
                profile: Omit<Profile, "id"> | null
            };
        }
    }
}

export {};
