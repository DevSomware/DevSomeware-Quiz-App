import express from "express";
import { createServer } from "http";
import websocket from "./websoket";
import cors from "cors";
const app = express();
export const httpserver = createServer(app);
websocket(httpserver);
app.get("/",(req,res)=>{
     res.status(200).json({message:"Server is up and running"})
})
httpserver.listen(3000,()=>{
    console.log("Server is running on port http://localhost:3000");
})