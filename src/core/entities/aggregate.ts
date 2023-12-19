import { DomainEvent } from '../events/domain-event';
import { DomainEvents } from '../events/domain-events';
import { Entity } from './entity';
import { EntityUniqueId } from './entity-unique-id';

export class Aggregate<props> extends Entity<props> {
  private _domainEvents: DomainEvent[] = [];

  constructor(props: props, id?: EntityUniqueId) {
    super(props, id);
  }

  protected addDomainEvent(event: DomainEvent) {
    this._domainEvents.push(event);

    DomainEvents.markAggregateForDispatch(this);
  }

  public getDomainEvents() {
    return this._domainEvents;
  }

  public clearDomainEvents() {
    this._domainEvents = [];
  }
}
