import { EventHandler } from '@/core/events/event-handler';
import { ProjectDeletedEvent } from '@/domain/projects/events/project-deleted-event';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction, LogTargetType } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnProjectDeleted implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      ProjectDeletedEvent.name,
    );
  }

  private async createLog({ project, occurredAt }: ProjectDeletedEvent) {
    await this.createLogService.exec({
      action: LogAction.deleted,
      targetType: LogTargetType.project,
      target: project,
      occurredAt,
    });
  }
}
