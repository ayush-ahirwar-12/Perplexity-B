import express from "express"
import chatController from "../controller/chat.controller.js";
const router = express.Router();

router.post("/message",chatController.generateResponse);



export default router;