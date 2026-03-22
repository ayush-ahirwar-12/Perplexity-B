import config from "./environment.js"
import { createClient } from "redis"

const {REDIS_HOST,REDIS_PORT,REDIS_PASSWORD} = config;

const redisClient = createClient({
    password:REDIS_PASSWORD,
    socket:{
        host:REDIS_HOST,
        port:REDIS_PORT
    }
})

redisClient.on("error",(err)=>{
    console.error("Redis connection error:",err.message);

})

redisClient.on("connect",()=>{
    console.log("Redis connected successfully");

})

export async function connectRedis(){
    try {
        await redisClient.connect();
    } catch (error) {
            console.error("Redis connection error:",error.message);
            process.exit(1);

    };
};

export { redisClient };

