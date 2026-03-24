import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage,AIMessage } from "langchain";
import { AppError } from "../utils/error.js";
import { MistralModel } from "../llm/AiModels.js";
import mongoChatRepository from "../repository/implementations/mongoChatRepository.js";

class aiService {
    constructor() {
        this.mongoChatRepository = new mongoChatRepository();
    }

    async generateResponse(chatId,messages) {
        if (!messages || !Array.isArray(messages)) {
            throw new AppError("Message array is required to generate a response", 404);
        }

        if (messages.length === 0) {
            // Nothing in chat history yet, caller should provide the user prompt.
            throw new AppError("Message array cannot be empty", 404);
        }

        const preparedMessages = messages.map((msg) => {
            if (msg.role === "user") {
                return new HumanMessage(msg.content);
            } else if (msg.role === "ai") {
                return new AIMessage(msg.content);
            } else if (msg.role === "system") {
                return new SystemMessage(msg.content);
            }
            throw new AppError(`Unsupported message role: ${msg.role}`, 400);
        });

        const response = await MistralModel.invoke(preparedMessages);

        if (!response || !response.text) {
            throw new AppError("Failed to generate a response", 500);
        }
        let savedMessage = await this.mongoChatRepository.generateMessageResponse(chatId,response.text);
        if (!savedMessage) {
            throw new AppError("Failed to save the message response", 500);
        }

        return savedMessage;
    }

    async generateChatTitle(UserId, message) {
         if (!message) {
            throw new AppError("Message is required to generate a response", 404);
        }
        let response = await MistralModel.invoke([
            new SystemMessage(`Generate a concise and descriptive title for the following chat message 
                
                User will provide you a first message of the chat ,and you will generate a title for that chat based on that first message.
                The title should be concise and descriptive, capturing the essence of the chat conversation. 
                The title should be no more than 5 words long and should not include any special characters or punctuation.
                Here is the first message of the chat
            `), new HumanMessage(`Generate a title for this message : ${message}`)
        ])
        const chat = await this.mongoChatRepository.generateChatResponse(UserId, response.text);
        if (!chat) {
            throw new AppError("Failed to save the chat response", 500);
        }
        return chat;
    }
}

export default aiService;

