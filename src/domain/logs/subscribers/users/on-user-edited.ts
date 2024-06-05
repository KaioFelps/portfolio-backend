import { EventHandler } from '@/core/events/event-handler';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction, LogTargetType } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { UserEditedEvent } from '@/domain/users/events/user-edited-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnUserEdited implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      UserEditedEvent.name,
    );
  }

  private async createLog({ occurredAt, user, dispatcherId }: UserEditedEvent) {
    await this.createLogService.exec({
      action: LogAction.updated,
      targetType: LogTargetType.user,
      target: user,
      dispatcherId,
      occurredAt,
    });
  }
}
