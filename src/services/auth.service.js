import jwt from "jsonwebtoken"
import config from "../config/environment.js"
import mongoose from "mongoose"
import UserModel from "../models/user.model.js"

class AuthService {

  // 🔥 Role logic removed → simple user check
  async hasPermission(userId) {
    try {
      const objectId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : null;

      if (!objectId) {
        throw new Error("Invalid user id provide");
      }

      const user = await UserModel.findById(objectId);

      return !!user; // true if user exists
    } catch (error) {
      console.error("Error in hasPermission:", error);
      throw new Error(`Error checking user: ${error.message}`);
    }
  }

  // ❗ FIX (important)
  verifyToken(token) {
    return jwt.verify(token, config.JWT_SECRET)
  }
}

export default AuthService