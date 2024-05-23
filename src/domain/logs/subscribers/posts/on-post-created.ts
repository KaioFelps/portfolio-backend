import { EventHandler } from '@/core/events/event-handler';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction, LogTargetType } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { PostCreatedEvent } from '@/domain/posts/events/post-created-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnPostCreated implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      PostCreatedEvent.name,
    );
  }

  private async createLog({
    post,
    occurredAt,
    dispatcherId,
  }: PostCreatedEvent) {
    await this.createLogService.exec({
      action: LogAction.created,
      targetType: LogTargetType.post,
      target: post,
      dispatcherId,
      occurredAt,
    });
  }
}
