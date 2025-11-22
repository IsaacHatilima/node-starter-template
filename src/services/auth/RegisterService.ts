import {PrismaClient} from "../../../generated/prisma/client";
import bcrypt from "bcrypt";
import {normalizeEmail, toTitleCase} from "../../utils/string";
import {container} from "../../lib/container";
import {sendMail} from "../../lib/mailer";

export class RegisterService {
    constructor(private db: PrismaClient) {
    }

    async register(data: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
    }) {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = await this.db.user.create({
                data: {
                    email: normalizeEmail(data.email),
                    password: hashedPassword,
                    profile: {
                        create: {
                            first_name: toTitleCase(data.first_name),
                            last_name: toTitleCase(data.last_name),
                        },
                    },
                },
                include: {profile: true},
                omit: {password: true},
            });

            const verificationToken =
                container.emailVerificationService.generateVerificationToken(
                    user.id,
                    user.email
                );

            const verificationUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;

            await sendMail(
                user.email,
                "Verify your email",
                `
                    <p>Hello ${user.profile?.first_name},</p>
                    <p>Please verify your email by clicking the link below:</p>
                    <p><a href="${verificationUrl}">Verify Email</a></p>
                  `
            );

            return user;

        } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                throw new Error("EMAIL_TAKEN");
            }
            throw error;
        }
    }
}


