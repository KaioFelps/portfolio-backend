import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Project } from '../entities/project';

export class ProjectCreatedEvent implements DomainEvent {
  occurredAt: Date;
  project: Project;

  constructor(project: Project) {
    this.project = project;
    this.occurredAt = new Date();
  }

  public getAggregateId(): EntityUniqueId {
    return this.project.id;
  }
}
