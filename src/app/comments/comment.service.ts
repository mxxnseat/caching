import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Cacheable } from 'src/lib/caching/decorators';

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

@Injectable()
export class CommentService {
  private readonly _axios: AxiosInstance;
  constructor() {
    this._axios = axios.create({
      baseURL: 'https://jsonplaceholder.typicode.com/comments',
    });
  }

  @Cacheable({ namespace: 'comments' })
  public async retrieve(idComment: string, options: any): Promise<any> {
    await sleep(1000);
    const result = await this._axios
      .get(`/${idComment}`, { params: options })
      .catch(() => null);
    if (!result) {
      return null;
    }
    return result.data;
  }

  @Cacheable({ namespace: 'comments' })
  public async list(options: any): Promise<any> {
    await sleep(1000);
    const result = await this._axios.get('', { params: options });
    return { data: result.data };
  }
}
