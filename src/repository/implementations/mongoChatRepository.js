import ChatModel from "../../models/chat.model.js";
import MessageModel from "../../models/message.model.js";
import IChatRepository from "../contracts/IChatRepository.js";

class mongoChatRepository extends IChatRepository {
    async generateChatResponse(UserId, title) {
        return await ChatModel.create(
            {
                UserId,
                title
            }
        )
    }
    async generateUserMessage(chatId, content) {
        return await MessageModel.create({
            chatId,
            content,
            role: "user"
        });
    }

    async generateMessageResponse(chatId,content) {
        return await MessageModel.create({
            chatId,
            content,
            role:"ai"
        });
    }
    async getAllMessagesByChatId(chatId) {
        return await MessageModel.find({ chatId });
    }
}
export default mongoChatRepository;