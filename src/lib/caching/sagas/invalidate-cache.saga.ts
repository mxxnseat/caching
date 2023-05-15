import { ICommand, IEvent, Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';
import { WebhookEvent } from 'src/entity/events/webhook.event';
import { Injectable } from '@nestjs/common';
import { InvalidateCacheCommand } from '../commands/impl';

@Injectable()
export class InvalidateCacheSaga {
  @Saga()
  public invalidateCache($events: Observable<IEvent>): Observable<ICommand> {
    return $events.pipe(
      ofType(WebhookEvent),
      map((e) => new InvalidateCacheCommand(e.id)),
    );
  }
}
