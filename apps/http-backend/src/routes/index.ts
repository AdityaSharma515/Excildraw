import { Router } from "express";
import authroutes from "../routes/auth.routes"
import boardroutes from "../routes/board.routes"
import userroutes from "../routes/collabarator.routes"

const router:Router =Router();
router.use("/auth",authroutes)
router.use("/boards",boardroutes)
router.use("/users",userroutes)

export default router