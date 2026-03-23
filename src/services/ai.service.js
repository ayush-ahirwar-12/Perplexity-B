import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage } from "langchain";
import { AppError } from "../utils/error.js";
import { MistralModel } from "../llm/AiModels.js";
import mongoChatRepository from "../repository/implementations/mongoChatRepository.js";

class aiService {
    constructor() {
        this.mongoChatRepository = new mongoChatRepository();
    }



    async generateResponse(userId,message) {
        if (!message) {
            throw new AppError("Message is required to generate a response", 404);
        }
        const response = await MistralModel.invoke([
            new HumanMessage(message)
        ])
        if (!response || !response.text) {
            throw new AppError("Failed to generate a response", 500);
        }

        return response.text;
    }

    async generateChatTitle(UserIdmessage) {
        let response = await MistralModel.invoke([
            new SystemMessage(`Generate a concise and descriptive title for the following chat message 
                
                User will provide you a first message of the chat ,and you will generate a title for that chat based on that first message.
                The title should be concise and descriptive, capturing the essence of the chat conversation. 
                The title should be no more than 5 words long and should not include any special characters or punctuation.
                Here is the first message of the chat
            `), new HumanMessage(`Generate a title for this message : ${message}`)
        ])
        return response.text;
    }
}

export default aiService;

