import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { DomainEvent } from '@/core/events/domain-event';
import { Project } from '../entities/project';

export class ProjectDeletedEvent implements DomainEvent {
  occurredAt: Date;
  project: string;
  projectId: EntityUniqueId;

  constructor(project: Project) {
    this.project = project.title;
    this.projectId = project.id;
    this.occurredAt = new Date();
  }

  public getAggregateId(): EntityUniqueId {
    return this.projectId;
  }
}
