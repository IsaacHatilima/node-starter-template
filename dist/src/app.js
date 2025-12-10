"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const routes_js_1 = __importDefault(require("@routes/routes.js"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_js_1 = require("@config/swagger.js");
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    (0, swagger_js_1.setupSwagger)(app);
    app.use(routes_js_1.default);
    return app;
}
