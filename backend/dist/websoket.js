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
    var feedbackarr = [];
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
        //take feedback
        socket.on("createfeedback", (data) => {
            console.log("taking feedback", data);
            let roomfeedback = feedbackarr.find((f) => f.room == data.room);
            if (!roomfeedback) {
                let temparr = {
                    totalcount: 0,
                    room: data.room,
                    ratings: [
                        { rating: 1, percentage: 0, count: 0 },
                        { rating: 2, percentage: 0, count: 0 },
                        { rating: 3, percentage: 0, count: 0 },
                        { rating: 4, percentage: 0, count: 0 },
                        { rating: 5, percentage: 0, count: 0 }
                    ]
                };
                feedbackarr.push(temparr);
            }
            console.log("feedbackarr", feedbackarr);
            let roomdata = feedbackarr.find((f) => f.room == data.room);
            io.to(data.room).emit("takefeedback", { type: "feedback", socketid: data.socketid });
            //sendingfeedback to admin
            io.to(data.socketid).emit("feedbackratings", roomdata.ratings);
        });
        //rating socket
        socket.on("rating", (data) => {
            console.log("rating", data);
            let roomfeedback = feedbackarr.find((f) => f.room == data.room);
            if (roomfeedback) {
                roomfeedback.totalcount += 1;
                roomfeedback.ratings[data.rating - 1].count += 1;
                roomfeedback.ratings.map((rate) => {
                    rate.percentage = (rate.count / roomfeedback.totalcount) * 100;
                });
            }
            console.log("feedbackarr", feedbackarr);
            console.log("socketid", data.socketid);
            io.to(data.socketid).emit("feedbackratings", roomfeedback.ratings);
        });
        //quiz started 
        socket.on("quizstarted", (data) => {
            console.log("quiz started", data);
            io.to(data.room).emit("quizstart", data.message);
        });
    });
};
exports.default = websocket;
