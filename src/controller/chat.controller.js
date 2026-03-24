import mongoChatRepository from "../repository/implementations/mongoChatRepository.js";
import aiService from "../services/ai.service.js";

class chatController {
    constructor() {
        this.aiService = new aiService();
        this.mongoChatRepository = new mongoChatRepository();
    }
    generateResponse = async (req, res, next) => {
        try {
            let { message, chatId } = req.body;
            let title =null ,chat=null

            let userId = req.userId;
            if (!chatId) {
                chat = await this.aiService.generateChatTitle(userId, message);
                title = chat.title;
            }

            const targetChatId = chatId || chat._id;

            // persist the incoming user message in the conversation
            await this.mongoChatRepository.generateUserMessage(targetChatId, message);

            let messages = await this.mongoChatRepository.getAllMessagesByChatId(targetChatId);
            if (!messages || messages.length === 0) {
                throw new Error("Failed to build message history after saving user message");
            }

            let AiMessage = await this.aiService.generateResponse(targetChatId, messages);

            res.status(201).json({
                success: true,
                title,
                chat,
                AiMessage
            });
        } catch (error) {
            next(error);
        }
    }


}

export default new chatController();