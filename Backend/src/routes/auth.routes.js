import { Router } from "express";
import {
  login,
  logoutUser,
  registerUser,
} from "../controllers/auth.controllers.js";
import validate from "../middlewares/validator.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {refreshAccessToken} from "../controllers/auth.controllers.js";
import { userRegisterValidator,userloginValidator } from "../validators/index.js";

const router = Router();

router.route("/register").post(userRegisterValidator(),validate, registerUser);
router.route("/login").post(userloginValidator(),validate ,login);
router.route("/refresh-token").post(refreshAccessToken);
//secure routes
router.route("/logout").post(verifyJWT, logoutUser);



export default router;
