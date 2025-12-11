import "dotenv/config";
import {PrismaClient} from "../generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";


const isTest = process.env.NODE_ENV === "local";
const schema = isTest ? "test" : "public";
console.log("[DB] Selected schema:", schema);

let adapter;
try {
    adapter = new PrismaPg(
        {connectionString: process.env.DATABASE_URL},
        {schema}
    );
    console.log("[DB] PrismaPg adapter created");
} catch (err) {
    console.error("[DB] Failed to create PrismaPg adapter:", err);
    throw err;
}

let prisma: PrismaClient;
try {
    prisma = new PrismaClient({adapter});
    console.log("[DB] PrismaClient instance created");
} catch (err) {
    console.error("[DB] Failed to instantiate PrismaClient:", err);
    throw err;
}

const connectDB = async () => {
    console.log("[DB] Attempting prisma.$connect()...");

    try {
        await prisma.$connect();
        console.log("[DB] prisma.$connect() SUCCESS");
    } catch (error) {
        console.error("[DB] prisma.$connect() ERROR:", error);
        console.error("[DB] This means Prisma failed to initialize.");
        process.exit(1);
    }
};

const disconnectDB = async () => {
    console.log("[DB] Disconnecting Prisma...");
    await prisma.$disconnect();
    console.log("[DB] Prisma disconnected.");
};

export {prisma, connectDB, disconnectDB};
