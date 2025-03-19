import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('3306'),
  DB_NAME: z.string().default('payment_api'),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default('12345678'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  EXTERNAL_SERVICE_URL: z.string().url(),
  CACHE_TTL: z.string().default('3600'),
  CACHE_KEY: z.string().default('payment'),
});

const env = envSchema.parse(process.env);

export const config = {
  server: {
    port: parseInt(env.PORT, 10),
    nodeEnv: env.NODE_ENV,
  },
  database: {
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT, 10),
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },
  redis: {
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT, 10),
  },
  externalService: {
    url: env.EXTERNAL_SERVICE_URL,
  },
  cache: {
    ttl: parseInt(env.CACHE_TTL, 10),
    key: env.CACHE_KEY,
  },
};
