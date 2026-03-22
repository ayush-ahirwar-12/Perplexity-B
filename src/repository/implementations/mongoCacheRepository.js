
import { redisClient } from "../../config/redis.js";
import ICacheRepository from "../contracts/ICacheRepository.js";

class MongoCacheRepository extends ICacheRepository {
  async get() {
    try {
      const data = await redisClient.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      throw new Error("Failed to get cache", 500, error);
    };
  };
  async set(key, value, ttl) {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      throw new Error("Failed to set cache", 500,error);
    };
  };
  async del(key) {
    try {
      await redisClient.del(key)
    } catch (error) {
      throw new Error("Failed to delete cache", 500, error)
    };
  };
};

export default MongoCacheRepository;
