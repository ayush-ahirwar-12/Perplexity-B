import { redisClient } from "../config/redis.js";
import dotenv from "dotenv";
import UserService from "../services/user.service.js";
import AuthService from "../services/auth.service.js";
dotenv.config();

class AuthController {
  constructor() {
    this.UserService = new UserService();
    this.AuthService = new AuthService();
  };
  get cookieOptions() {
    const isProd = process.env.NODE_ENV === "production";
    console.log(process.env.NODE_ENV);
    console.log({
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    };
  };

  register = async (req, res, next) => {
    try {
      const userData = req.body;
      const result = await this.UserService.createUser(userData);

      res.cookie("token", result.token, {
        ...this.cookieOptions,
        maxAge: 60 * 60 * 1000,
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    };
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const result = await this.UserService.login(email,password)
      console.log(result);
      

      res.cookie("token", result.token, {
        ...this.cookieOptions,
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refreshToken", result.refreshToken, {
        ...this.cookieOptions,
        maxAge: 60 * 60 * 1000,
      });

      res.status(200).json({ success: true, data: result ,expiresIn: 3600 });
    } catch (error) {
      next(error);
    };
  };

  update = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const newData = req.body;
      const result =await this.UserService.update(userId, newData);

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    };
  };

  logout = async(req,res,next)=>{
    try {
          const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ","");
    if(token){
      const decoded = this.AuthService.verifyToken(token);
      const exp = decoded.exp*1000;
    const ttl = Math.floor((exp-Date.now())/1000);
    if(ttl>0){
      await redisClient.setEx(`bl_${token}`,ttl,"blacklisted");
    };
    };
    res.clearCookie("token",this.cookieOptions)
    res.clearCookie("refreshToken",this.cookieOptions);

    res.status(200).json({success:true,message:"logged out successfully"});
    } catch (error) {
      next(error)
    };

  };
};

export default new AuthController();
