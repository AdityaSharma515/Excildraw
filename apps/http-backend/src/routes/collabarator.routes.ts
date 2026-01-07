import { Request,Response,NextFunction, Router } from "express";
const router:Router=Router();
router.post("/boards/:id/collaborators",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"Not Emplemented"
    });
});
router.get("/boards/:id/collaborators",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"Not Emplemented"
    });
});
router.delete("/boards/:id/collaborators/:userId",(req:Request,res:Response,next:NextFunction)=>{
    res.json({
        message:"Not Emplemented"
    });
});
export default router;