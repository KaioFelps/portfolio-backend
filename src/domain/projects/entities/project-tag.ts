import { Entity } from '@/core/entities/entity';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';

export interface ProjectTagProps {
  value: string;
  projectId: EntityUniqueId;
}

export class ProjectTag extends Entity<ProjectTagProps> {
  constructor(props: ProjectTagProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(props: ProjectTagProps, id?: EntityUniqueId) {
    const tag = new ProjectTag({ ...props }, id);
    return tag;
  }

  get value() {
    return this.props.value;
  }

  get projectId() {
    return this.projectId;
  }

  set value(value: string) {
    this.props.value = value;
  }
}
