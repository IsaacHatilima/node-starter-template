import request from "supertest";
import {createApp} from "../../../app";
import {createAuthUser} from "../../test-helpers";
import bcrypt from "bcrypt";
import {prisma} from "../../../src/config/db";
import {generateAccessToken} from "../../../src/lib/jwt";
import speakeasy from "speakeasy";

const app = createApp();

describe("GET /settings/2fa/setup", () => {
    it("user can initiate 2FA setup", async () => {
        const created = await createAuthUser();

        const res = await request(app)
            .post("/settings/2fa/setup")
            .set("Cookie", `access_token=${created.access_token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("2FA setup initiated");
        expect(res.body.data.secret).toBeDefined();
        expect(res.body.data.qr_code).toBeDefined();
    });
});

describe("POST /settings/2fa/enable", () => {
    it("user can enable 2FA with valid code", async () => {
        const created = await createAuthUser();

        const setupRes = await request(app)
            .post("/settings/2fa/setup")
            .set("Cookie", `access_token=${created.access_token}`);

        const secret = setupRes.body.data.secret;
        const code = speakeasy.totp({
            secret: secret,
            encoding: "base32"
        });

        const res = await request(app)
            .post("/settings/2fa/enable")
            .set("Cookie", `access_token=${created.access_token}`)
            .send({
                code: code
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("2FA enabled");
        expect(res.body.data.enabled).toBe(true);
        expect(res.body.data.backup_codes).toHaveLength(8);

        const user = await prisma.user.findUnique({where: {id: created.user.id}});
        expect(user?.two_factor_enabled).toBe(true);
        expect(user?.two_factor_secret).toBe(secret);
    });

    it("user cannot enable 2FA without code", async () => {
        const created = await createAuthUser();

        const res = await request(app)
            .post("/settings/2fa/enable")
            .set("Cookie", `access_token=${created.access_token}`)
            .send({});

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContain("Token is required");
    });

    it("user cannot enable 2FA with invalid code", async () => {
        const created = await createAuthUser();

        await request(app)
            .post("/settings/2fa/setup")
            .set("Cookie", `access_token=${created.access_token}`);

        const res = await request(app)
            .post("/settings/2fa/enable")
            .set("Cookie", `access_token=${created.access_token}`)
            .send({
                code: "000000"
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContain("Invalid two-factor authentication code.");
    });
});

describe("POST /settings/2fa/disable", () => {
    it("user can disable 2FA", async () => {
        const hashedPassword = await bcrypt.hash("Password1#", 10);
        const secret = speakeasy.generateSecret().base32;

        const user = await prisma.user.create({
            data: {
                email: "totptest@example.com",
                password: hashedPassword,
                two_factor_enabled: true,
                two_factor_secret: secret,
                two_factor_recovery_codes: ["BACKUP123456"],
                profile: {
                    create: {
                        first_name: "Totp",
                        last_name: "Test",
                    },
                },
            },
        });

        const access_token = generateAccessToken({
            id: user.id,
            email: user.email,
        });

        const res = await request(app)
            .post("/settings/2fa/disable")
            .set("Cookie", `access_token=${access_token}`)
            .send({});

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("2FA disabled");

        const updated = await prisma.user.findUnique({where: {id: user.id}});
        expect(updated?.two_factor_enabled).toBe(false);
        expect(updated?.two_factor_secret).toBeNull();
    });
});

describe("POST /settings/2fa/regenerate", () => {
    it("user can regenerate backup codes", async () => {
        const created = await createAuthUser();

        // Enable 2FA first
        const setupRes = await request(app)
            .post("/settings/2fa/setup")
            .set("Cookie", `access_token=${created.access_token}`);

        const secret = setupRes.body.data.secret;
        const code = speakeasy.totp({
            secret: secret,
            encoding: "base32"
        });

        await request(app)
            .post("/settings/2fa/enable")
            .set("Cookie", `access_token=${created.access_token}`)
            .send({code});

        const res = await request(app)
            .post("/settings/2fa/regenerate")
            .set("Cookie", `access_token=${created.access_token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Backup codes regenerated");
        expect(res.body.data.backup_codes).toBeDefined();
        expect(res.body.data.backup_codes).toHaveLength(8);
    });

    it("user cannot regenerate backup codes if 2FA not enabled", async () => {
        const created = await createAuthUser();

        const res = await request(app)
            .post("/settings/2fa/regenerate")
            .set("Cookie", `access_token=${created.access_token}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContain("Two-factor authentication is not enabled.");
    });
});
