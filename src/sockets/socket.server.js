import {Server} from "socket.io";
import { AppError } from "../utils/error.js";

let io;

export function initSocket(httpServer){
    io = new Server({
        cors:"http://localhost:3000",
        credentials:true
    })

    console.log("Socket io is running");

    io.on("connection",(socket)=>{
        console.log("A user connected"+socket.id);
        
    })
    
}

export function getIo(){
    if(!io){
        throw new AppError("Socket io not initialised",500);
    }
    return io;
}