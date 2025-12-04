import request from "supertest";
import {createApp} from "../../app";

const app = createApp();

describe("POST /auth/register", () => {
    it("user can register", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({
                first_name: "John",
                last_name: "Doe",
                email: "johndoes@mail.com",
                password: "Password1#"
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Registered successfully.");
    });
});