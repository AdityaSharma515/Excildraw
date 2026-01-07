import {Router, Request, Response} from "express"
import { information, signin, signup } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";
const router:Router=Router();
router.post("/auth/signup",signup);
router.post("/auth/signin", signin );
router.get("/auth/me",auth,information);
export default router
