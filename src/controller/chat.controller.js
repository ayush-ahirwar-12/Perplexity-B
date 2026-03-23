import aiService from "../services/ai.service.js";

class chatController {
    constructor() {
        this.aiService = new aiService();
    }
    generateResponse = async (req, res, next) => {
        try {
            let { message } = req.body;
            let userId = req.userId;
            let chatTitle = await this.aiService.generateChatTitle(userId, message);

            let AiMessage = await this.aiService.generateResponse(chatTitle._id,message);

            res.status(201).json({
                success: true,
                chatTitle,
                AiMessage
            })
        } catch (error) {
            next(error)
        }
    }


}

export default new chatController();