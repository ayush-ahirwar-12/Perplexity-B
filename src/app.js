import express from "express";
import cookie from "cookie-parser"
import AuthRoute from "./routes/auth.route.js"
const app = express();



app.use(express.json());
app.use(cookie());


app.use("/api/auth",AuthRoute);









export default app;