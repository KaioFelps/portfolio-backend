import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Entity } from '@/core/entities/entity';

export interface ProjectLinkProps {
  title: string;
  value: string;
  projectId: EntityUniqueId;
}

export class ProjectLink extends Entity<ProjectLinkProps> {
  constructor(props: ProjectLinkProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(props: ProjectLinkProps, id?: EntityUniqueId) {
    const link = new ProjectLink({ ...props }, id);
    return link;
  }

  get value() {
    return this.props.value;
  }

  get title() {
    return this.props.title;
  }

  get projectId(): EntityUniqueId {
    return this.props.projectId;
  }

  set value(value: string) {
    this.props.value = value;
  }

  set title(value: string) {
    this.props.title = value;
  }
}
