import { Router } from "express";
import client from 'prom-client'
import authroutes from "../routes/auth.routes"
import boardroutes from "../routes/board.routes"
import userroutes from "../routes/collabarator.routes"

const router:Router =Router();
router.use("/auth",authroutes)
router.use("/boards",boardroutes)
router.use("/users",userroutes)
router.get("/metrics",async (req,res)=>{
    const metrics=await client.register.metrics();
    res.set('Content-Type',client.register.contentType)
    res.end(metrics);
})

export default router