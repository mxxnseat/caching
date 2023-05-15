import { Injectable } from '@nestjs/common';

export interface IEntity {
  id: string;
  name: string;
}

@Injectable()
export class EntityRepository {
  private _store: IEntity[] = [];

  public create(name: string): IEntity {
    const data: IEntity = { id: (this._store.length + 1).toString(), name };
    this._store.push(data);
    return data;
  }

  public async retrieve(id: string): Promise<IEntity | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this._store.find((e) => e.id === id) ?? null;
        resolve(data);
      }, 1000);
    });
  }

  public update(id: string, data: any): IEntity | null {
    const obj = this._store.find((s) => s.id === id);
    if (!obj) {
      return null;
    }
    obj.name = data.name;
    return obj;
  }
}
