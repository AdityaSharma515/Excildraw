import {Router} from "express"
import { googlecallback, information, signin, signup } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";
import passport from "passport";
const router:Router=Router();
router.post("/signup",signup);
router.post("/signin", signin );
router.get("/me",auth,information);
router.get("/google", passport.authenticate("google",{scope:["email","profile"],session:false,prompt: "select_account"}));
router.get("/google/callback",passport.authenticate("google",{session:false}),googlecallback)
export default router
