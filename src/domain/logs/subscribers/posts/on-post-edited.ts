import { EventHandler } from '@/core/events/event-handler';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { PostEditedEvent } from '@/domain/posts/events/post-edited-event';

export class OnPostEdited implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      PostEditedEvent.name,
    );
  }

  private async createLog({ occurredAt, post, dispatcherId }: PostEditedEvent) {
    await this.createLogService.exec({
      action: LogAction.updated,
      target: post,
      dispatcherId,
      occurredAt,
    });
  }
}
