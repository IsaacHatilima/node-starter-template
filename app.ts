import "dotenv/config";
import express from "express";
import router from "./src/routes";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(router);

app.listen(3000);
