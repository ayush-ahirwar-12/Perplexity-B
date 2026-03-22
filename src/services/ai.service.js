import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "langchain";


const model = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
});

export async function generateResponse(message){
    const response = await model.invoke([
        new HumanMessage(message)
    ])
    return response.text;
}