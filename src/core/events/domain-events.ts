import { Aggregate } from '../entities/aggregate';
import { EntityUniqueId } from '../entities/entity-unique-id';
import { DomainEvent } from './domain-event';

type DomainEventCallback = (event: unknown) => void;

/**
 * This class manages the whole application instance's domain events
 *
 * It should never be implemented neither instantiated
 */
export abstract class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {};
  private static markedAggregates: Aggregate<unknown>[] = [];

  private static aggregateEventsMap: Map<string, DomainEvent[]> = new Map();

  public static AggregateEvent = class {
    public static 'clearEveryAggregateEvent!'() {
      DomainEvents.aggregateEventsMap.clear();
    }

    public static getAggregateEvents(id: EntityUniqueId) {
      return DomainEvents.aggregateEventsMap.get(id.toValue()) ?? [];
    }

    public static clearAggregateEvents(id: EntityUniqueId) {
      DomainEvents.aggregateEventsMap.delete(id.toValue());
    }

    public static addAggregateEvent(id: EntityUniqueId, event: DomainEvent) {
      if (!DomainEvents.aggregateEventsMap.get(id.toValue()))
        return DomainEvents.aggregateEventsMap.set(id.toValue(), [event]);

      DomainEvents.aggregateEventsMap.get(id.toValue())!.push(event);
    }
  };

  public static markAggregateForDispatch(aggregate: Aggregate<unknown>) {
    const aggregateFound = this.findMarkedAggregateById(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  public static removeAggregatedFromMarkedList(aggregate: Aggregate<unknown>) {
    const itemIndex = this.markedAggregates.findIndex((item) =>
      item.id.equals(aggregate.id),
    );

    this.markedAggregates.splice(itemIndex, 1);
  }

  public static dispatchEventsForAggregate(id: EntityUniqueId) {
    const aggregate = this.findMarkedAggregateById(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearDomainEvents();
      this.removeAggregatedFromMarkedList(aggregate);
    }
  }

  public static registerAggregateEvent(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const eventHasBeenRegisteredBefore = eventClassName in this.handlersMap;

    if (!eventHasBeenRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);
  }

  public static clearHandlers() {
    this.handlersMap = {};
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = [];
  }

  // ========

  private static dispatchAggregateEvents(aggregate: Aggregate<unknown>) {
    aggregate.getDomainEvents().forEach((event) => {
      this.dispatch(event);
    });

    aggregate.clearDomainEvents();
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName = event.constructor.name;

    const eventIsRegistered = eventClassName in this.handlersMap;

    if (eventIsRegistered) {
      const handlers = this.handlersMap[eventClassName];

      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  private static findMarkedAggregateById(aggregateId: EntityUniqueId) {
    return this.markedAggregates.find((item) => item.id.equals(aggregateId));
  }
}
