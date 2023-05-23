import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from 'src/lib/redis/redis.constants';
import { hashArguments, isListResponse, isPlainObject } from '../utils';
import { CACHE_PREFIX, DEFAULT_NAMESPACE } from '../caching.constant';

export const Cacheable = (
  {
    ttl,
    namespace,
  }: {
    ttl?: number;
    namespace?: string;
  } = {
    ttl: 60 * 60,
    namespace: DEFAULT_NAMESPACE,
  },
): MethodDecorator => {
  const inject = Inject(REDIS_CLIENT);
  ttl = ttl ?? 60 * 60;
  namespace = namespace ?? DEFAULT_NAMESPACE;
  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    inject(target, 'redisClient');
    const original = propertyDescriptor.value;

    propertyDescriptor.value = async function (...args: any[]) {
      const redisClient: Redis = this.redisClient;
      const hash = hashArguments([CACHE_PREFIX, namespace, ...args]);
      const cache = await redisClient.get(hash);
      if (cache) {
        return JSON.parse(cache);
      }
      const result = await original.apply(this, args);
      if (result) {
        await redisClient.setex(hash, ttl, JSON.stringify(result));
        if (isListResponse(result)) {
          await Promise.all([
            result.data.map((item) =>
              redisClient.setex(
                `${hashArguments([
                  CACHE_PREFIX,
                  namespace,
                  item.id,
                ])}:association:list`,
                ttl,
                hash,
              ),
            ),
          ]);
        } else if (Array.isArray(result)) {
          await Promise.all([
            result.map((item) =>
              redisClient.setex(
                `${hashArguments([
                  CACHE_PREFIX,
                  namespace,
                  item.id,
                ])}:association:list`,
                ttl,
                hash,
              ),
            ),
          ]);
        } else {
          redisClient.setex(
            `${hashArguments([
              CACHE_PREFIX,
              namespace,
              result.id,
            ])}:association`,
            ttl,
            hash,
          );
        }
      }
      return result;
    };
  };
};

/**
 * {id: 123, name: "hello"} RETRIEVE OBJECT
 * ^
 * |
 *\/
 * {data: [
 *    {id: 123, name: "hello"} LIST RESPONSE
 *  ]
 * }
 *
 * Storage:
 * {
 *  [hash]: RETRIEVE_OBJECT
 *  [hash]: LIST OBJECT
 *  [LIST OBJECT ITEM ID]: hash
 * }
 *
 */
