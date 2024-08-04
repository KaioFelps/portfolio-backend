import { DomainEvent } from '../events/domain-event';
import { DomainEvents } from '../events/domain-events';
import { Entity } from './entity';
import { EntityUniqueId } from './entity-unique-id';

export class Aggregate<props> extends Entity<props> {
  constructor(props: props, id?: EntityUniqueId) {
    super(props, id);
  }

  protected addDomainEvent(event: DomainEvent) {
    DomainEvents.AggregateEvent.addAggregateEvent(this.id, event);
    DomainEvents.markAggregateForDispatch(this);
  }

  public getDomainEvents() {
    return DomainEvents.AggregateEvent.getAggregateEvents(this.id);
  }

  public clearDomainEvents() {
    DomainEvents.AggregateEvent.clearAggregateEvents(this.id);
  }

  /**
   * Cleans up aggregate resources and free them from singletones. I.e. clean aggregate events from DomainEvents singletone.
   *
   * Must be called everytime a event or other memory-persistent method is called envolving the aggregate.
   * You should assure the dispose method is called by using a try-catch block:
   *
   * ```js
   * // registered a new event for this aggregate in the DomainEvents singletone
   * DomainEvents.addAggregateEvent(aggregate, event);
   *
   * // this method is suppose to clean some resource (i.e. domain event) by dispatching it
   * // but if it fails, it won't be able to dispose!
   * async function someMethodThatMayThrowError(aggregate) {
   *    throw new Error();
   *    // didn't dispatch nor cleared the event for the aggregate
   *    DomainEvents.dispatchAndClearEvent(aggregate)
   * }
   *
   * try {
   *    await someMethodThatMayThrowError();
   * } finally {
   *    // so you can call the dispose in a finally block and assure it will free the memory up!
   *    // you don't need to treat the error here if you will treat it later.
   *    aggregate.dispose();
   * }
   * ```
   */
  public dispose() {
    DomainEvents.AggregateEvent.clearAggregateEvents(this.id);
  }
}
