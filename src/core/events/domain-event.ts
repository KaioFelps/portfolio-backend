import { EntityUniqueId } from '../entities/entity-unique-id';

export abstract class DomainEvent {
  abstract occurredAt: Date;
  public abstract getAggregateId(): EntityUniqueId;
}
