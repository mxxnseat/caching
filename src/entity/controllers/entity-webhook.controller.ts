import { EventBus } from '@nestjs/cqrs';
import { Body, Controller, Post } from '@nestjs/common';
import { EntityService } from '../services';
import { WebhookEvent } from '../events';

@Controller('entity-webhook')
export class EntityWebhookController {
  constructor(
    private readonly _entityService: EntityService,
    private readonly _eventBus: EventBus,
  ) {}
  @Post()
  public async webhook(@Body() body: any): Promise<void> {
    this._entityService.update(body.id, body);
    console.log(this._eventBus.publish(new WebhookEvent(body.id)));
  }
}
