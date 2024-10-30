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
    var arr = {};
    io.on("connection", (socket) => {
        console.log("connected to server" + socket.id);
        socket.on("disconnect", (data) => {
            console.log("disconnected from server", data);
        });
        //creating room
        socket.on("createroom", (data) => {
            arr[data.room] = [];
        });
        //joining room
        socket.on("joinroom", (data) => {
            console.log("joining room", data.room);
            socket.join(data.room);
        });
        //not in use
        socket.on("enteryourname", (data) => {
            console.log("enter your name", data);
            socket.to(data.room).emit("turnonprompt", data.yes);
        });
        //add user to room
        socket.on("adduser", (data) => {
            console.log("adding user", data);
            if (!arr[data.room]) {
                arr[data.room] = [];
            }
            arr[data.room].push(data.user);
            io.to(data.room).emit("participants", arr[data.room]);
        });
        //remove user from room
        socket.on("removeuser", (data) => {
            console.log("removing user", data);
            arr[data.room] = arr[data.room].filter((user) => user != data.user);
            socket.to(data.room).emit("userleft", { data: arr[data.room], user: data.user });
        });
        //create user input
        socket.on("createuserinput", (data) => {
            console.log("creating user input", data);
            io.to(data.room).emit("userinputcreated", { question: data.question, socketid: data.socketid });
        });
        //sending usermessage to admin
        socket.on("sendtoadmin", (data) => {
            console.log("sending to admin", data);
            io.to(data.socketid).emit("usermessage", { name: data.name, answer: data.answer });
        });
        //create alert
        socket.on("createalert", (data) => {
            console.log("creating alert", data);
            io.to(data.room).emit("alertcreated", { message: data.message });
        });
    });
};
exports.default = websocket;
