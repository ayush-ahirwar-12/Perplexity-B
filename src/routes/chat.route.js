import express from "express"
import chatController from "../controller/chat.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/message",authMiddleware,chatController.generateResponse);
router.get("/chats",authMiddleware,chatController.getChatsOfUser);



export default router;