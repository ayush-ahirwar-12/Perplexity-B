import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage } from "langchain";


const model = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
});

export async function generateResponse(message) {
    const response = await model.invoke([
        new HumanMessage(message)

        
    ])
    return response.text;
}

export async function generateChatTitle(message) {
    let response = await model.invoke([
        new SystemMessage(`Generate a concise and descriptive title for the following chat message 
                
                User will provide you a first message of the chat ,and you will generate a title for that chat based on that first message.
                The title should be concise and descriptive, capturing the essence of the chat conversation. 
                The title should be no more than 5 words long and should not include any special characters or punctuation.
                Here is the first message of the chat
            `), new HumanMessage(`Generate a title for this message : ${message}`)
    ])
    return response.text;
}