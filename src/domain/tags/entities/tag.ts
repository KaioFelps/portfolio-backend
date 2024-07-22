import { Aggregate } from '@/core/entities/aggregate';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { TagCreatedEvent } from '../events/tag-created-event';
import { TagDeletedEvent } from '../events/tag-deleted-event';
import { TagEditedEvent } from '../events/tag-edited-event';

export interface TagProps {
  value: string;
}

export class Tag extends Aggregate<TagProps> {
  private constructor(props: TagProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(props: TagProps, id?: EntityUniqueId) {
    const tag = new Tag(
      {
        ...props,
      },
      id,
    );

    return tag;
  }

  get value() {
    return this.props.value;
  }

  set value(value: string) {
    this.props.value = value;
  }

  public addCreatedEventToDispatch() {
    this.addDomainEvent(new TagCreatedEvent(this));
  }

  public addDeletedEventToDispatch() {
    this.addDomainEvent(new TagDeletedEvent(this));
  }

  public addEditedEventToDispatch() {
    this.addDomainEvent(new TagEditedEvent(this));
  }
}
