import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from 'src/lib/redis/redis.constants';
import { hashArguments } from '../utils';
import { CACHE_PREFIX } from '../caching.constant';

@Injectable()
export class CachingService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly _redis: Redis,
  ) {}
  public async invalidate(
    keys: unknown[],
    options: { strict: boolean } = { strict: false },
  ): Promise<void> {
    const hash = hashArguments([CACHE_PREFIX, keys]);
    if (options.strict) {
      const reply = await this._redis.get(`${hash}:association`);
      if (reply) {
        await this._redis.del(reply);
      }
      await this._redis.del(hash);
      return;
    }
    // Cursor type is string, because redis returns string values
    let cursor = '0';
    do {
      const reply = await this._redis.scan(
        cursor,
        'MATCH',
        `${hash}*`,
        'COUNT',
        100,
      );
      cursor = reply[0];
      const keys = reply[1];
      if (keys) {
        keys.map(async (key) => {
          const isAssociationKey = key.includes('association');
          if (isAssociationKey) {
            const associationHash = await this._redis.get(key);
            await this._redis.del(associationHash);
          }
          await this._redis.del(key);
        });
      }
    } while (cursor !== '0');
  }
}
