import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InvalidateCacheCommand } from '../impl/invalidate-cache.command';
import { CachingService } from '../../services/caching.service';

@CommandHandler(InvalidateCacheCommand)
export class InvalidateCacheHandler
  implements ICommandHandler<InvalidateCacheCommand>
{
  constructor(private readonly _cachingService: CachingService) {}
  public async execute({ key }: InvalidateCacheCommand): Promise<void> {
    await this._cachingService.invalidate(key);
  }
}
