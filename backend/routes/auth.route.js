import express from "express";
import {
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import loginLimiter from "../middleware/loginLimiter.js";

const router = express.Router();

router.post("/", loginLimiter, login);
router.get("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.get("/resetpassword", resetPassword);

export default router;
