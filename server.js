import app from "./src/app.js";
import { connectDb } from "./src/config/database.js";
import config from "./src/config/environment.js"
import { connectRedis } from "./src/config/redis.js";
import "./src/workers/emailWorker.js";


const {PORT} = config;
const startServer = async()=>{
    try {
        await connectDb()

        await connectRedis();

        app.listen(PORT,()=>{
            console.log(`Server connected on port ${PORT}`);
            
        })
    } catch (error) {
        console.log("error while connecting server");
        
    }
    


}
startServer();