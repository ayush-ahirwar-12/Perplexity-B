import express from "express";
import cookie from "cookie-parser"
import AuthRoute from "./routes/auth.route.js"
import cors from "cors"
const app = express();




app.use(express.json());
app.use(cookie());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))


app.use("/api/auth",AuthRoute);









export default app;