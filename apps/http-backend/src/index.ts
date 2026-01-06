import express from "express";
import router from "./routes/auth.routes";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
const app=express();
dotenv.config();
app.use(express.json());
app.use(cookieParser())
app.use("/api/v1",router)


app.listen(3001);