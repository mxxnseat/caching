import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EntityService } from '../services';
import { IEntity } from '../repositories';

@Controller('entities')
export class EntityController {
  constructor(private readonly _entityService: EntityService) {}

  @Post()
  public create(@Body('name') name: string): IEntity {
    return this._entityService.create(name);
  }

  @Get(':id')
  public async retrieve(
    @Param('id') id: string,
    @Query() opt?: Record<string, unknown>,
  ): Promise<IEntity | null> {
    return this._entityService.retrieve(id, opt);
  }
}
