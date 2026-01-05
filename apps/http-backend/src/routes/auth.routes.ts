import {Router, Request, Response} from "express"
import { signup } from "../controllers/auth.controller";
const router:Router=Router();
router.post("/auth/signup",signup);
router.post("/auth/signin", (req: Request, res: Response) => { res.status(501).json({ message: "Not implemented" }); });
router.get("/auth/me", (req: Request, res: Response) => { res.status(501).json({ message: "Not implemented" }); });
export default router
