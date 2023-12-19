import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Project } from '../entities/project';

export class ProjectCreatedEvent implements DomainEvent {
  ocurredAt: Date;
  project: Project;

  constructor(project: Project) {
    this.project = project;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): EntityUniqueId {
    return this.project.id;
  }
}
