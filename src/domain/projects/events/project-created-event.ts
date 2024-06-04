import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Project } from '../entities/project';

export class ProjectCreatedEvent implements DomainEvent {
  occurredAt: Date;
  project: string;
  projectId: EntityUniqueId;

  constructor(project: Project) {
    this.project = project.title;
    this.occurredAt = new Date();
    this.projectId = project.id;
  }

  public getAggregateId(): EntityUniqueId {
    return this.projectId;
  }
}
