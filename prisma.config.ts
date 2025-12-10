import "dotenv/config";
import {defineConfig} from "prisma/config";

export default defineConfig({
    schema: "prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        //url: env("DATABASE_URL"),
        url: process.env.DATABASE_URL!
    },
});
