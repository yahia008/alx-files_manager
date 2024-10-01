import { createClient } from 'redis';
import { promisify } from 'util';

// Class for defining methods for commonly used Redis commands.
class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    });
  }

  // Verify the connection status and provide a report.
  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

  // Retrieve the value associated with a given key from the Redis server.
  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    const value = await redisGet(key);
    return value;
  }

  // Store a key-value pair in the Redis server.
  async set(key, value, time) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    await this.client.expire(key, time);
  }

  // Remove a key-value pair from the Redis server.
  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
