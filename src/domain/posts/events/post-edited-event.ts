import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Post } from '../entities/post';

export class PostEditedEvent implements DomainEvent {
  occurredAt: Date;
  post: string;
  dispatcherId: EntityUniqueId;
  postId: EntityUniqueId;

  constructor(post: Post) {
    this.post = post.title;
    this.dispatcherId = post.authorId;
    this.occurredAt = new Date();
    this.postId = post.id;
  }

  public getAggregateId(): EntityUniqueId {
    return this.postId;
  }
}
