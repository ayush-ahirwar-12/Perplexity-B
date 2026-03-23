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
    async generateMessageResponse(chatId,content) {
        // This method is a placeholder for generating a message response and can be implemented as needed.
        // For example, you could save the message to the database or perform other operations.
        return await MessageModel.create({
            chatId,
            content,
            role:"ai"
        });
    }
}
export default mongoChatRepository;