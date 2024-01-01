import { EventHandler } from '@/core/events/event-handler';
import { CreateLogService } from '../../services/create-log-service';
import { LogAction } from '../../entities/log';
import { DomainEvents } from '@/core/events/domain-events';
import { PostCreatedEvent } from '@/domain/posts/events/post-created-event';

export class OnPostEdited implements EventHandler {
  constructor(private createLogService: CreateLogService) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.registerAggregateEvent(
      this.createLog.bind(this),
      PostCreatedEvent.name,
    );
  }

  private async createLog({ post, occurredAt }: PostCreatedEvent) {
    await this.createLogService.exec({
      action: LogAction.updated,
      target: post.title,
      dispatcherId: post.authorId,
      occurredAt,
    });
  }
}
