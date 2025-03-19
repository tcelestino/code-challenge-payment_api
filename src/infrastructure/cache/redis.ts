import { config } from '@config/environment';
import Redis from 'ioredis';

export const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  lazyConnect: true,
});

export async function initializeRedis(): Promise<void> {
  try {
    await redisClient.connect();
    console.log('Redis connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to Redis:', error);
    throw error;
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const data = await redisClient.get(key);
  if (!data) return null;
  return JSON.parse(data) as T;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds = config.cache.ttl): Promise<void> {
  await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

export async function cacheDelete(key: string): Promise<void> {
  await redisClient.del(key);
}
