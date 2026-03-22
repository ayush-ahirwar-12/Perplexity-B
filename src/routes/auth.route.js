import express from "express";
import authController from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register",authController.register);
router.post("/login",authController.login);
router.post("/logout",authMiddleware,authController.logout);
router.patch("/update/:id",authController.update);



export default router;