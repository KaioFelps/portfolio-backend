import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Post } from '../entities/post';

export class PostCreatedEvent implements DomainEvent {
  occurredAt: Date;
  post: Post;

  constructor(post: Post) {
    this.post = post;
    this.occurredAt = new Date();
  }

  public getAggregateId(): EntityUniqueId {
    return this.post.id;
  }
}
