import { Module } from '@nestjs/common';
import { RedisModule } from './lib/redis/redis.module';
import { EntityModule } from './entity/entity.module';
import { ConfigModule } from '@nestjs/config';
import { redisConfig } from './config/redis.config';
import { CachingModule } from './lib/caching/caching.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [redisConfig] }),
    RedisModule.forRoot(),
    EntityModule,
    CachingModule,
  ],
})
export class AppModule {}
