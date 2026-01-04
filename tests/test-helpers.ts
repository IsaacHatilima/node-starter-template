import {prisma} from "../src/config/db";
import bcrypt from "bcrypt";
import {generateAccessToken} from "../src/lib/jwt";
import {User} from "../src/generated/prisma/client";
import {faker} from "@faker-js/faker";

export async function createAuthUser(): Promise<{ user: User; access_token: string }> {
    const hashedPassword = await bcrypt.hash("Password1#", 10);

    const user = await prisma.user.create({
        data: {
            email: faker.internet.email().toLowerCase(),
            password: hashedPassword,
            profile: {
                create: {
                    first_name: "Me",
                    last_name: "Test",
                },
            },
        },
    });

    const access_token = generateAccessToken({
        id: user.id,
        email: user.email,
    });

    return {user, access_token};
}

export async function createPublicUser() {
    const hashedPassword = await bcrypt.hash("Password1#", 10);

    return prisma.user.create({
        data: {
            email: faker.internet.email().toLowerCase(),
            password: hashedPassword,
            profile: {
                create: {
                    first_name: "Me",
                    last_name: "Test",
                },
            },
        },
    });
}


