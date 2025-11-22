import {defineConfig, env} from "prisma/config";
import * as dotenv from "dotenv";
import * as path from "node:path";

dotenv.config();

export default defineConfig({
    schema: path.join("prisma", "schema.prisma"),
    migrations: {
        path: "prisma/migrations",
    },
    engine: "classic",
    datasource: {
        url: env("DATABASE_URL"),
    },
});
