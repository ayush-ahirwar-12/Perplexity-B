import ChatModel from "../../models/chat.model.js";
import IChatRepository from "../contracts/IChatRepository.js";

class mongoChatRepository extends IChatRepository {
    async generateResponse(UserId, title) {
        return await ChatModel.create(
            {
                UserId,
                title
            }
        )
    }
}

export default mongoChatRepository;