import express from "express";
import { loginValidator, userRegistrationValidator } from "../validators/user.validators.js";
import { validate } from "../middlewares/validator.middlerware.js";
import { signIn, signup,getProfile,logOut} from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", userRegistrationValidator(), validate, signup);
router.post("/signIn",loginValidator(),validate,signIn)
router.get("/profile",verifyJwt,getProfile)
router.post("/logOut",verifyJwt,logOut);

export default router;