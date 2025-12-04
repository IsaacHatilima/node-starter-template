import {connectDB, disconnectDB, prisma} from "../src/config/db";
import {initRedis} from "../src/config/redis";

const provider = process.env.PROVIDER || "sqlite";

async function resetPostgresDatabase() {
    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name != '_prisma_migrations';
    `;

    for (const {table_name} of tables) {
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "${table_name}" RESTART IDENTITY CASCADE;`
        );
    }
}

async function resetSQLiteDatabase() {
    const tables = await prisma.$queryRaw<
        Array<{ name: string }>
    >`SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
        AND name != '_prisma_migrations';`;

    for (const {name} of tables) {
        await prisma.$executeRawUnsafe(`DELETE
                                        FROM "${name}";`);
    }
}

beforeAll(async () => {
    await connectDB();
    await initRedis();
    if (provider === "sqlite") {
        await resetSQLiteDatabase();
    } else {
        await resetPostgresDatabase();
    }
});

afterAll(async () => {
    await disconnectDB();
});
