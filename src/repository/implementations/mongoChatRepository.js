import ChatModel from "../../models/chat.model.js";
import MessageModel from "../../models/message.model.js";
import { AppError } from "../../utils/error.js";
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
    async getAllMessagesByChatId(chatId,UserId) {
        const chat = await ChatModel.findOne({
            _id:chatId,
            UserId
        });
        if(!chat){
            throw new AppError("Chat not found");
        }
        return await MessageModel.find({ chatId });
    }
    async getAllChatsOfUser(UserId){
        let chats = await ChatModel.find({UserId});
        return chats;
    }
}
export default mongoChatRepository;