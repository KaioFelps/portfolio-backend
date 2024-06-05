import { EventHandler } from '@/core/events/event-handler';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction, LogTargetType } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { UserCreatedEvent } from '@/domain/users/events/user-created-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnUserCreated implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      UserCreatedEvent.name,
    );
  }

  private async createLog({
    user,
    occurredAt,
    dispatcherId,
  }: UserCreatedEvent) {
    await this.createLogService.exec({
      action: LogAction.created,
      targetType: LogTargetType.user,
      target: user,
      dispatcherId,
      occurredAt,
    });
  }
}
