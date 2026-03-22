import { generateResponse } from "../services/ai.service.js";

class chatController {
    generateResponse = async (req,res,next) => {
        try {
            let {message} = req.body;
            let result=await generateResponse(message);

            res.status(201).json({
                success:true,
                response:result
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new chatController();