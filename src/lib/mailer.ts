import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
    host: process.env.MAIL_HOST ?? "localhost",
    port: Number(process.env.MAIL_PORT) ?? 1025,
    secure: false,
    auth: process.env.MAIL_USERNAME
        ? {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
        : undefined,
});

export async function sendMail(to: string, subject: string, html: string) {
    await mailer.sendMail({
        from: process.env.MAIL_FROM ?? "noreply@example.com",
        to,
        subject,
        html,
    });
}
