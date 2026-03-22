import express from "express";
import cookie from "cookie-parser"
import AuthRoute from "./routes/auth.route.js"
import cors from "cors"
import morgan from "morgan";
import ChatRoute from "./routes/chat.route.js"




const app = express();




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use(cookie());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))


app.use("/api/auth",AuthRoute);
app.use("/api/chats",ChatRoute);










export default app;