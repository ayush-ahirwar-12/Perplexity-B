import { model } from "mongoose";
import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import { SystemMessage } from "langchain";

class chatController {
    generateResponse = async (req, res, next) => {
        try {
            let { message } = req.body;
            let title = await generateChatTitle(message);

            let result = await generateResponse(message);

            res.status(201).json({
                success: true,
                title:title,
                Airesponse: result
            })
        } catch (error) {
            next(error)
        }
    }


}

export default new chatController();