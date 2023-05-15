import {
  DynamicModule,
  FactoryProvider,
  Inject,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common';
import { defer, lastValueFrom } from 'rxjs';
import Redis from 'ioredis';
import { redisConfig, RedisConfig } from 'src/config/redis.config';
import { REDIS_CLIENT } from './redis.constants';

export class RedisModule implements OnApplicationShutdown {
  static forRoot(): DynamicModule {
    const redisClientProvider = RedisModule.createRedisProvider(REDIS_CLIENT);

    return {
      global: true,
      module: RedisModule,
      providers: [redisClientProvider],
      exports: [redisClientProvider],
    };
  }

  static createRedisProvider(provideToken: symbol): FactoryProvider {
    const logger = new Logger(RedisModule.name);
    return {
      provide: provideToken,
      inject: [redisConfig.KEY],
      useFactory: async (config: RedisConfig) =>
        await lastValueFrom(
          defer(async () => {
            logger.log(`Connecting to redis ${config.host}:${config.port}...`);
            const redis = new Redis(config);
            await redis.ping();
            return redis;
          }),
        ),
    };
  }
  private readonly _logger = new Logger(RedisModule.name);
  constructor(@Inject(REDIS_CLIENT) private readonly _redisClient: Redis) {}

  async onApplicationShutdown(): Promise<void> {
    await Promise.allSettled([this._redisClient.quit()]);
    this._logger.log(`Connection to redis is destroyed`);
  }
}
