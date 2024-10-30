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
    let arr = [];
    io.on("connection", (socket) => {
        console.log("connected to server" + socket.id);
        socket.on("disconnect", (data) => {
            console.log("disconnected from server", data);
        });
        //joining room
        socket.on("joinroom", (data) => {
            console.log("joining room", data.room);
            socket.join(data);
            arr.push(data.name);
            io.to(data).emit("joined", arr);
        });
    });
};
exports.default = websocket;
