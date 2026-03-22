import dotenv from "dotenv"
dotenv.config();






export default {
    PORT: process.env.PORT,
    JWT_SECRET:process.env.JWT_SECRET,
    MONGO_URI:process.env.MONGO_URI,
    REDIS_PORT:process.env.REDIS_PORT,
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD,
    BREVO_API_KEY:process.env.BREVO_API_KEY,
    REFRESH_SECRET:process.env.REFRESH_SECRET,
    REFRESH_EXPIRES:process.env.REFRESH_EXPIRES,
    NODE_ENV:process.env.NODE_ENV,
    GROQ_API_KEY:process.env.GROQ_API_KEY


};