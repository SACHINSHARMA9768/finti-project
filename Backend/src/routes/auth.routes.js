import { Router } from "express";
import {
  getProfile,
  login,
  logoutUser,
  registerUser,
  updateProfile,
} from "../controllers/auth.controllers.js";
import validate from "../middlewares/validator.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../controllers/auth.controllers.js";
import {
  userRegisterValidator,
  userloginValidator,
} from "../validators/index.js";
import { verifyEmailOTP } from "../controllers/OTP.js";

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/verify-email").post(verifyEmailOTP);
router.route("/login").post(userloginValidator(), validate, login);
router.route("/refresh-token").post(refreshAccessToken);
//secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/profile").get(verifyJWT, getProfile);
router.route("/profile").patch(verifyJWT, updateProfile);

export default router;
