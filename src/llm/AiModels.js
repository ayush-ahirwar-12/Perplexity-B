import { ChatMistralAI } from "@langchain/mistralai";

export const MistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
});