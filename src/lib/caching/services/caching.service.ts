import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from 'src/lib/redis/redis.constants';

@Injectable()
export class CachingService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly _redis: Redis,
  ) {}
  public async invalidate(identifier: string): Promise<void> {
    const stringKeys = await this._redis.get(identifier);
    console.log({ stringKeys });
    if (stringKeys) {
      await Promise.all([
        this._redis.del(identifier),
        ...JSON.parse(stringKeys).map((key) => this._redis.del(key)),
      ]);
    }
  }
}
