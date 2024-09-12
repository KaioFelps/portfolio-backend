import { EventHandler } from '@/core/events/event-handler';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction, LogTargetType } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { TagDeletedEvent } from '@/domain/tags/events/tag-deleted-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnTagDeleted implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      TagDeletedEvent.name,
    );
  }

  private async createLog({ tag, occurredAt }: TagDeletedEvent) {
    await this.createLogService.exec({
      action: LogAction.deleted,
      targetType: LogTargetType.tag,
      target: tag,
      occurredAt,
    });
  }
}
