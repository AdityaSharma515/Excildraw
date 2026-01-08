import { Router } from "express";
import { auth } from "../middleware/auth";
import { createBoard, deleteBoard, getBoard, getElements, openBoard, saveElements, saveSnapshots, viewVersions } from "../controllers/board.controllers";
const router:Router=Router();
router.post("/",auth,createBoard);
router.get("/",auth,getBoard);
router.get("/:id",auth,openBoard);
router.delete("/:id",auth,deleteBoard);
router.get("/:id/elements",auth,getElements);
router.put("/:id/elements",auth,saveElements);
router.post("/:id/versions",auth,saveSnapshots);
router.get("/:id/versions",auth,viewVersions)
export default router;