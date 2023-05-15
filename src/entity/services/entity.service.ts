import { Injectable } from '@nestjs/common';
import { Cacheable } from 'src/lib/caching/decorators';
import { EntityRepository, IEntity } from '../repositories';

@Injectable()
export class EntityService {
  constructor(private readonly _entityRepository: EntityRepository) {}
  public create(name: string): IEntity {
    return this._entityRepository.create(name);
  }
  @Cacheable()
  public async retrieve(
    id: string,
    options?: Record<string, unknown>,
  ): Promise<IEntity | null> {
    const res = await this._entityRepository.retrieve(id);
    if (!res) {
      return null;
    }
    if ('test' in options) {
      return {
        ...res,
        name: res.name + 'with_options',
      };
    }
    return res;
  }
  public update(id: string, data: any): IEntity | null {
    return this._entityRepository.update(id, data);
  }
}
