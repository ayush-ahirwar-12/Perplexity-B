import aiService from "../services/ai.service.js";

class chatController {
    constructor() {
        this.aiService = new aiService();
    }
    generateResponse = async (req, res, next) => {
        try {
            let { message } = req.body;
            let userId = req.userId;
            let chat = await this.aiService.generateChatTitle(userId, message);

            let result = await this.aiService.generateResponse(message);

            res.status(201).json({
                success: true,
                title:chat.title,
                Airesponse: result.text
            })
        } catch (error) {
            next(error)
        }
    }


}

export default new chatController();