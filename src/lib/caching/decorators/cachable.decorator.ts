import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from 'src/lib/redis/redis.constants';
import * as crypto from 'node:crypto';

export const Cachable = (
  {
    ttl,
    identifier,
  }: {
    ttl?: number;
    identifier?: string;
  } = {
    ttl: 60 * 60,
    identifier: 'id',
  },
): MethodDecorator => {
  const inject = Inject(REDIS_CLIENT);
  identifier = identifier ?? 'id';
  ttl = ttl ?? 60 * 60;
  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    inject(target, 'redisClient');
    const original = propertyDescriptor.value;

    propertyDescriptor.value = async function (...args: any[]) {
      const redisClient: Redis = this.redisClient;
      const key = crypto
        .createHash('md5')
        .update(JSON.stringify(args))
        .digest('hex');
      const cache = await redisClient.get(key);
      if (cache) {
        return JSON.parse(cache);
      }
      const result = await original.apply(this, args);
      if (result) {
        const existingKeysByIdentifier = await redisClient.get(
          result[identifier],
        );
        await Promise.all([
          redisClient.setex(key, ttl, JSON.stringify(result)),
          redisClient.setex(
            result[identifier],
            ttl,
            JSON.stringify([
              ...(existingKeysByIdentifier
                ? JSON.parse(existingKeysByIdentifier)
                : []),
              key,
            ]),
          ),
        ]);
      }
      return result;
    };
  };
};
