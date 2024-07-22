import { Entity } from '@/core/entities/entity';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Tag } from '@/domain/tags/entities/tag';

export interface ProjectTagProps {
  projectId: EntityUniqueId;
  tag: Tag;
}

export class ProjectTag extends Entity<ProjectTagProps> {
  private constructor(props: ProjectTagProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(props: ProjectTagProps, id?: EntityUniqueId) {
    const projectTag = new ProjectTag({ ...props }, id);
    return projectTag;
  }

  get tag() {
    return this.props.tag;
  }

  get projectId() {
    return this.props.projectId;
  }
}
