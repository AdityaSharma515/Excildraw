import { Router } from "express";
import { addCollaborator, deleteCollaborator, getCollaborator } from "../controllers/collabrator.controller";
import { auth } from "../middleware/auth";
const router:Router=Router();
router.post("/boards/:id/collaborators",auth,addCollaborator);
router.get("/boards/:id/collaborators",auth,getCollaborator);
router.delete("/boards/:id/collaborators/:userId",auth,deleteCollaborator);
export default router;