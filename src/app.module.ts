import { Module } from '@nestjs/common';
import { RedisModule } from './lib/redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { redisConfig } from './config/redis.config';
import { CachingModule } from './lib/caching/caching.module';
import { CommentModule } from './app/comments/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [redisConfig] }),
    RedisModule.forRoot(),
    CommentModule,
    CachingModule,
  ],
})
export class AppModule {}
