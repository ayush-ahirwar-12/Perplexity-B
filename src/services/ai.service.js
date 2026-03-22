import { ChatMistralAI } from "@langchain/mistralai";




const model = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
});