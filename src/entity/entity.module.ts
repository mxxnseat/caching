import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EntityController, EntityWebhookController } from './controllers';
import { EntityRepository } from './repositories';
import { EntityService } from './services';

@Module({
  imports: [CqrsModule],
  controllers: [EntityController, EntityWebhookController],
  providers: [EntityRepository, EntityService],
})
export class EntityModule {}
