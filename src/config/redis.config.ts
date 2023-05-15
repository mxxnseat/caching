import { registerAs, type ConfigType } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const redisConfig = registerAs(
  'redis',
  (): RedisOptions => ({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: +(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD,
    db: +(process.env.REDIS_DB ?? 0),
  }),
);

export type RedisConfig = ConfigType<typeof redisConfig>;
