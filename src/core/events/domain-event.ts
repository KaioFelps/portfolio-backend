import { EntityUniqueId } from '../entities/entity-unique-id';

export abstract class DomainEvent {
  abstract ocurredAt: Date;
  public abstract getAggregateId(): EntityUniqueId;
}
