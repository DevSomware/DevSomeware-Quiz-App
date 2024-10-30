"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpserver = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const websoket_1 = __importDefault(require("./websoket"));
const app = (0, express_1.default)();
exports.httpserver = (0, http_1.createServer)(app);
(0, websoket_1.default)(exports.httpserver);
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is up and running" });
});
exports.httpserver.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000");
});
