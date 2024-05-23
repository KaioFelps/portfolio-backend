import { EventHandler } from '@/core/events/event-handler';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction, LogTargetType } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { PostDeletedEvent } from '@/domain/posts/events/post-deleted-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnPostDeleted implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      PostDeletedEvent.name,
    );
  }

  private async createLog({
    post,
    occurredAt,
    dispatcherId,
  }: PostDeletedEvent) {
    await this.createLogService.exec({
      action: LogAction.deleted,
      targetType: LogTargetType.post,
      target: post,
      dispatcherId,
      occurredAt,
    });
  }
}
