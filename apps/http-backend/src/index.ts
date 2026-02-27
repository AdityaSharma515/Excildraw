import path from "path";
import dotenv from "dotenv"
dotenv.config({path: path.resolve(__dirname, "../.env")});
import express from "express";
import router from "./routes/index";
import cors from "cors"
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport-setup"
const app=express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}))
app.use(cookieParser())
app.use(passport.initialize());
app.use("/api/v1",router)

const PORT=process.env.PORT||3001
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
});

