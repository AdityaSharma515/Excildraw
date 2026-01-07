import { Response,Request,NextFunction, Router } from "express";
import { auth } from "../middleware/auth";
import { createBoard, deleteBoard, getBoard, openBoard } from "../controllers/board.controllers";
const router:Router=Router();
router.post("/",auth,createBoard);
router.get("/",auth,getBoard);
router.get("/:id",auth,openBoard);
router.delete("/:id",auth,deleteBoard);
router.get("/:id/elements",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"Not Emplemented"
    });
});
router.put("/:id/elements",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"Not Emplemented"
    });
});
router.post("/:id/versions",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"Not Emplemented"
    });
});
router.get("/:id/versions",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"Not Emplemented"
    });
})
export default router;