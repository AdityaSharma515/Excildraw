import {Router, Request, Response} from "express"
import { information, signin, signup } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";
const router:Router=Router();
router.post("/signup",signup);
router.post("/signin", signin );
router.get("/me",auth,information);
export default router
