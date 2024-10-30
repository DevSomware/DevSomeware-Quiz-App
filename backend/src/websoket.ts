import { Server } from "socket.io";
const websocket =(httpserver:any)=>{
    const io = new Server(httpserver,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        },
    })
    io.on("connection",(socket)=>{
        console.log("connected to server"+socket.id);
        socket.on("disconnect",(data)=>{
            console.log("disconnected from server",data);
        })
        
    }) 
}
export default websocket