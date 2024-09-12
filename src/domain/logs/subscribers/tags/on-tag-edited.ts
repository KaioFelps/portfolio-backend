import { EventHandler } from '@/core/events/event-handler';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction, LogTargetType } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { TagEditedEvent } from '@/domain/tags/events/tag-edited-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnTagEdited implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      TagEditedEvent.name,
    );
  }

  private async createLog({ occurredAt, tag }: TagEditedEvent) {
    await this.createLogService.exec({
      action: LogAction.updated,
      targetType: LogTargetType.tag,
      target: tag,
      occurredAt,
    });
  }
}
