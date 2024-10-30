"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const websocket = (httpserver) => {
    const io = new socket_io_1.Server(httpserver, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        },
    });
    io.on("connection", (socket) => {
        console.log("connected to server" + socket.id);
        socket.on("disconnect", (data) => {
            console.log("disconnected from server", data);
        });
    });
};
exports.default = websocket;
