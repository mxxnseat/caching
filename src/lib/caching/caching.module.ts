import { Global, Module } from '@nestjs/common';
import { CachingController } from './controllers/caching.controller';
import { CachingService } from './services';

@Global()
@Module({
  controllers: [CachingController],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
