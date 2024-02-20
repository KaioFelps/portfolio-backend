import { Entity } from '@/core/entities/entity';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';

export interface ProjectTagProps {
  projectId: EntityUniqueId;
  value: string;
}

export class ProjectTag extends Entity<ProjectTagProps> {
  private constructor(props: ProjectTagProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(props: ProjectTagProps, id?: EntityUniqueId) {
    const projectTag = new ProjectTag({ ...props }, id);
    return projectTag;
  }

  get value() {
    return this.props.value;
  }

  get projectId() {
    return this.props.projectId;
  }
}
