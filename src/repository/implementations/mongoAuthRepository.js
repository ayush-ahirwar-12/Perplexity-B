import UserModel from "../../models/user.model.js";
import IAuthRepository from "../contracts/IAuthImplementation.js";

class mongoAuthRepository extends IAuthRepository {
    async createUser(data) {
        try {
            const user = new UserModel(data);
            const savedUser = await user.save();
            return savedUser;
        } catch (error) {
            console.error("Error creating user:", error);
        };
    };
    async findUserbyEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            console.log("Error in finding user", error);
        };
    };

    async findUserbyId(id){
        try {
            const user = await UserModel.findById(id);
        return user;
        } catch (error) {
            console.log("error in finding user",error);
            
        }
    }
  


    async update(userId, newData) {
        try {
            return await UserModel.findByIdAndUpdate(userId, newData, { new: true });
        } catch (error) {
            throw new AppError("Error in updating User", 501, error);
        };
    };
}

export default mongoAuthRepository;