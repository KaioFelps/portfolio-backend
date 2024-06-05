import { EventHandler } from '@/core/events/event-handler';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction, LogTargetType } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { UserDeletedEvent } from '@/domain/users/events/user-deleted-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnUserDeleted implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      UserDeletedEvent.name,
    );
  }

  private async createLog({
    user,
    occurredAt,
    dispatcherId,
  }: UserDeletedEvent) {
    await this.createLogService.exec({
      action: LogAction.deleted,
      targetType: LogTargetType.user,
      target: user,
      dispatcherId,
      occurredAt,
    });
  }
}
