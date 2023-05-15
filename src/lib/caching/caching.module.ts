import { Global, Module } from '@nestjs/common';
import { InvalidateCacheHandler } from './commands/handlers';
import { InvalidateCacheSaga } from './sagas';
import { CachingService } from './services';

@Global()
@Module({
  providers: [CachingService, InvalidateCacheHandler, InvalidateCacheSaga],
  exports: [CachingService],
})
export class CachingModule {}
