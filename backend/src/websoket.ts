import { Server } from "socket.io";
const websocket =(httpserver:any)=>{
    const io = new Server(httpserver,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        },
    })
    let arr=[];
    io.on("connection",(socket)=>{
        console.log("connected to server"+socket.id);
        socket.on("disconnect",(data)=>{
            console.log("disconnected from server",data);
        })
        //joining room
        socket.on("joinroom",(data)=>{
            console.log("joining room",data.room);
            socket.join(data);
            
            arr.push(data.name);
            io.to(data).emit("joined",arr);
        })
        
    }) 
}
export default websocket