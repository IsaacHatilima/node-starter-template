import {connectDB, disconnectDB, prisma} from "../src/config/db";
import {initRedis, redis} from "../src/config/redis";


vi.mock("../src/lib/mailer", () => ({
    sendMail: vi.fn().mockResolvedValue(true),
    buildEmailTemplate: vi.fn().mockReturnValue("<html></html>"),
    mailer: {
        sendMail: vi.fn().mockResolvedValue(true),
    }
}));

async function resetDatabases() {
    const tables = await prisma.$queryRaw<
        Array<{ table_name: string }>
    >`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'test'
          AND table_name != '_prisma_migrations';
    `;

    for (const {table_name} of tables) {
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "test"."${table_name}" RESTART IDENTITY CASCADE;`
        );
    }

    if (redis.isOpen) {
        await redis.flushDb();
    }
}

beforeAll(async () => {
    await connectDB();
    await initRedis();
});

beforeEach(async () => {
    await resetDatabases();
});

afterAll(async () => {
    await disconnectDB();
    if (redis.isOpen) {
        await redis.quit();
    }
});
