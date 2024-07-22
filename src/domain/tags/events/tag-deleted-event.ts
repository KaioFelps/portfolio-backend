import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Tag } from '../entities/tag';

export class TagDeletedEvent implements DomainEvent {
  occurredAt: Date;
  tag: string;
  tagId: EntityUniqueId;

  constructor(tag: Tag) {
    this.tag = tag.value;
    this.tagId = tag.id;
    this.occurredAt = new Date();
  }

  public getAggregateId(): EntityUniqueId {
    return this.tagId;
  }
}
