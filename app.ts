import express from "express";
import router from "./src/routes/routes";
import cookieParser from "cookie-parser";

export function createApp() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(router);
    return app;
}
