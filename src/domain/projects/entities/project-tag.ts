import { Entity } from '@/core/entities/entity';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';

export interface ProjectTagProps {
  tagId: EntityUniqueId;
  projectId: EntityUniqueId;
}

export class ProjectTag extends Entity<ProjectTagProps> {
  private constructor(props: ProjectTagProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(props: ProjectTagProps, id?: EntityUniqueId) {
    const projectTag = new ProjectTag({ ...props }, id);
    return projectTag;
  }

  get tagId() {
    return this.props.tagId;
  }

  get projectId() {
    return this.props.projectId;
  }
}
