import mongoAuthRepository from "../repository/implementations/mongoAuthRepository.js";
import MongoCacheRepository from "../repository/implementations/mongoCacheRepository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { emailQueue } from "../queues/EmailQueue.js";
import { AppError } from "../utils/error.js";
import config from "../config/environment.js"


const { JWT_SECRET, REFRESH_SECRET, REFRESH_EXPIRES } = config;

class UserService {
  constructor() {
    this.UserRepository = new mongoAuthRepository();
    this.cacheRepository = new MongoCacheRepository();
  }

  async saveRefreshToken(userId, refreshToken) {
    await this.cacheRepository.set(
      `refresh:${userId}`,
      refreshToken,
      7 * 24 * 3600,
    );
  };

  _getSafeUserPayload(user) {
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || null,
      isVerified: user.isVerified,
    };
  } 
  async createUser(data) {
    console.log("data---->", data);

    const email = data.email.toLowerCase().trim();
    const cacheKey = `user:email:${email}`;

    let isExist = null;
    if (!isExist) {
      isExist = await this.UserRepository.findUserbyEmail(email);
      if (isExist) {
        await this.cacheRepository.set(cacheKey, JSON.stringify(isExist), 3600);
        console.log(isExist, "existuser");
      };
    };
    if (isExist) {
      throw new Error("Email already exists", 409);
    };

    const user = await this.UserRepository.createUser({ ...data, email });    

    const userWithRole = await this.UserRepository.findUserbyId(user._id);

    if (!userWithRole) throw new Error("Failed to fetch create user");

    const safeUser = this._getSafeUserPayload(userWithRole);

    await this.cacheRepository.set(
      `user:id:${userWithRole._id}`,
      JSON.stringify(safeUser),
      3600,
    );

    await this.cacheRepository.set(
      cacheKey,
      JSON.stringify({ ...safeUser, password: user.password }),
      3600,
    );
    const jwtPayload = {
      id: safeUser._id,
      email: safeUser.email,
      firstName: safeUser.firstName,
      lastName: safeUser.lastName,
      isVerified: safeUser?.isVerified,
    };

    try {
      emailQueue.add(
        "verification-mail",
        {
          id: safeUser._id,
          email: safeUser.email,
          name: safeUser.firstName,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );
      console.info(`Welcome email job queued for ${safeUser?.email}`);
    } catch (error) {
      console.log("Failed to queue Verification email", {
        email: safeUser.email,
        error: error.message,
      });
    }

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })
    return { user: safeUser, token };
  };

  async login(email, password) {
    try {
      const user = await this.UserRepository.findUserbyEmail(email);
      if (!user) throw new AppError("User not found", 404);

      user.comparePassword = async (pwd) => bcrypt.compare(pwd, user.password);

      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new AppError("Invalid Credentials", 401);

      const userWithRole = await this.UserRepository.findUserbyId(user._id);
      if (!userWithRole) throw new AppError("Failed to authenticate user", 500);

      const safeUser = this._getSafeUserPayload(userWithRole)

      const jwtPayload = {
        id: safeUser._id,
        email: safeUser.email,
        firstName: safeUser.firstName,
        lastName: safeUser.lastName,
        role: safeUser?.role?.name,
        isVerified: safeUser?.isVerified,
      };

      const token = jwt.sign(jwtPayload,JWT_SECRET, { expiresIn: "1h" });
      const refreshToken = jwt.sign({ id: userWithRole._id },REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

      await this.saveRefreshToken(userWithRole._id, refreshToken)

      return {
        user: safeUser,
        token,
        refreshToken

      }
    } catch (error) {
      console.log(error);

      throw new AppError("Error in login", 500, error);
    }
  }

  async update(userId, newData) {
    const updatedUser = await this.UserRepository.update(userId, newData)
    if (!updatedUser) {
      throw new AppError("User not Found", 404);
    };

    const safeUser = this._getSafeUserPayload(updatedUser);
    await this.cacheRepository.set(
      `user:id:${userId}`,
      JSON.stringify(safeUser),
      3600,
    );
    if (newData.email && newDataData.email !== user.email) {
      await this.cacheRepository.del(`user:email:${newData.email}`)
    }
    await this.cacheRepository.set(
      `user:email:${updatedUser.email}`,
      JSON.stringify(safeUser),
      3600,
    )
    return safeUser
  };

  async updateUserRole(userId, newRoleId) {
    await this.UserRepository.update(userId, { roleId: newRoleId });

    const updatedUser = await this.UserRepository.findUserbyId(userId, true);

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    const safeUser = {
      _id: updatedUser._id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phoneNumber: updatedUser.phoneNumber,
      isVerified: updatedUser.isVerified,
      role: updatedUser.roleId
        ? { _id: updatedUser.roleId._id, name: updatedUser.roleId.name }
        : null,
    };

    // 4️⃣ Update cache
    await this.cacheRepository.set(
      `user:id:${userId}`,
      JSON.stringify(safeUser),
      3600
    );

    await this.cacheRepository.set(
      `user:email:${updatedUser.email}`,
      JSON.stringify(safeUser),
      3600
    );
        return safeUser;
  }





};

export default UserService;
