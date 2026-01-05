import { Router } from "express";
const router:Router=Router();
router.post("/boards/:id/collaborators");
router.get("/boards/:id/collaborators");
router.delete("/boards/:id/collaborators/:userId");
export default router;