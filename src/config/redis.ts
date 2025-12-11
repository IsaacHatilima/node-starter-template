import {createClient} from "redis";

export const redis = createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
});


redis.on("error", (err) => {
    console.error("[REDIS] Client error:", err);
});

export async function initRedis() {
    console.log("[REDIS] Initializing Redis...");

    try {
        if (!redis.isOpen) {
            await redis.connect();
        }

        console.log("[REDIS] Connected successfully");
    } catch (err) {
        console.error("[REDIS] Failed to connect:", err);

        process.exit(1);
    }
}
