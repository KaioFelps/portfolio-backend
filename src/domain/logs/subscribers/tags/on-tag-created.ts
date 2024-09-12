import { EventHandler } from '@/core/events/event-handler';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction, LogTargetType } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { TagCreatedEvent } from '@/domain/tags/events/tag-created-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnTagCreated implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      TagCreatedEvent.name,
    );
  }

  private async createLog({ tag, occurredAt }: TagCreatedEvent) {
    await this.createLogService.exec({
      action: LogAction.created,
      targetType: LogTargetType.tag,
      target: tag,
      occurredAt,
    });
  }
}
