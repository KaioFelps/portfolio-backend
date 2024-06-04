import { EventHandler } from '@/core/events/event-handler';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction, LogTargetType } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { ProjectEditedEvent } from '@/domain/projects/events/project-edited-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnProjectEdited implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      ProjectEditedEvent.name,
    );
  }

  private async createLog({ occurredAt, project }: ProjectEditedEvent) {
    await this.createLogService.exec({
      action: LogAction.updated,
      targetType: LogTargetType.project,
      target: project,
      occurredAt,
    });
  }
}
