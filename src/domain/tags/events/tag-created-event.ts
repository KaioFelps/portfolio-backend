import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Tag } from '../entities/tag';

export class TagCreatedEvent implements DomainEvent {
  occurredAt: Date;
  tag: string;
  tagId: EntityUniqueId;

  constructor(tag: Tag) {
    this.tag = tag.value;
    this.occurredAt = new Date();
    this.tagId = tag.id;
  }

  public getAggregateId(): EntityUniqueId {
    return this.tagId;
  }
}
