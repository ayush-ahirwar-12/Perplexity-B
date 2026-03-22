import app from "./src/app.js";
import { connectDb } from "./src/config/database.js";
import config from "./src/config/environment.js"
import http  from "http"
import { connectRedis } from "./src/config/redis.js";
import "./src/workers/emailWorker.js";
import { initSocket } from "./src/sockets/socket.server.js";

const httpServer = http.createServer(app);
initSocket(httpServer)

const {PORT} = config;
const startServer = async()=>{
    try {
        await connectDb()

        await connectRedis();

        httpServer.listen(PORT,()=>{
            console.log(`Server connected on port ${PORT}`);
            
        })
    } catch (error) {
        console.log("error while connecting server");
        
    }
    


}
startServer();