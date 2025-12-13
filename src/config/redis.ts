import {createClient} from "redis";
import {logger} from "../lib/logger.js";

export const redis = createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
});

redis.on("error", (err) => {
    logger.error(
        {err},
        "[REDIS] Client error"
    );
});

export async function initRedis() {
    logger.info("[REDIS] Initializing Redis...");

    try {
        if (!redis.isOpen) {
            await redis.connect();
        }

        logger.info("[REDIS] Connected successfully");
    } catch (err) {
        logger.fatal(
            {err},
            "[REDIS] Failed to connect"
        );

        process.exit(1);
    }
}

