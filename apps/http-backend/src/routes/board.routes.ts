import { Response,Request,NextFunction, Router } from "express";
import { auth } from "../middleware/auth";
import { createBoard, deleteBoard, getBoard, openBoard } from "../controllers/board.controllers";
const router:Router=Router();
router.post("/boards",auth,createBoard);
router.get("/boards",auth,getBoard);
router.get("/boards/:id",auth,openBoard);
router.delete("/boards/:id",auth,deleteBoard);
router.get("/boards/:id/elements",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"Not Emplemented"
    });
});
router.put("/boards/:id/elements",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"Not Emplemented"
    });
});
router.post("/boards/:id/versions",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"Not Emplemented"
    });
});
router.get("/boards/:id/versions",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"Not Emplemented"
    });
})
export default router;