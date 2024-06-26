import { EventHandler } from '@/core/events/event-handler';
import { ProjectCreatedEvent } from '@/domain/projects/events/project-created-event';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction, LogTargetType } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnProjectCreated implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      ProjectCreatedEvent.name,
    );
  }

  private async createLog({ project, occurredAt }: ProjectCreatedEvent) {
    await this.createLogService.exec({
      action: LogAction.created,
      target: project,
      targetType: LogTargetType.project,
      occurredAt,
    });
  }
}
