import { Body, Controller, Post, Query } from '@nestjs/common';
import { CachingService } from '../services';

@Controller('caching')
export class CachingController {
  constructor(private readonly _cachingService: CachingService) {}
  @Post()
  public async invalidate(@Body() body: any, @Query() options): Promise<void> {
    await this._cachingService.invalidate(body, options);
  }
}
