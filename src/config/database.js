import config from "./environment.js";
import mongoose from "mongoose"
const { MONGO_URI } = config;

export async function connectDb() {
  try {
    await mongoose.connect(MONGO_URI, {});
    console.log("Database Connected");
  } catch (error) {
    console.log("Error while connecting database", error);
    process.exit(1);
  };
};
