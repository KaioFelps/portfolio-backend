import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { DomainEvent } from '@/core/events/domain-event';
import { User } from '../entities/user';

export class UserCreatedEvent implements DomainEvent {
  occurredAt: Date;
  user: string;
  userId: EntityUniqueId;
  dispatcherId: EntityUniqueId;

  constructor(user: User, adminId: EntityUniqueId) {
    this.user = user.name;
    this.userId = user.id;
    this.occurredAt = new Date();
    this.dispatcherId = adminId;
  }

  public getAggregateId(): EntityUniqueId {
    return this.userId;
  }
}
