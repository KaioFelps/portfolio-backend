import { Entity } from '@/core/entities/entity';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';

interface ProjectProps {
  title: string;
  topstory: string;
  tags: string[];
  links: string[];
  createdAt: Date;
}

export class Project extends Entity<ProjectProps> {
  constructor(props: ProjectProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(
    props: Optional<ProjectProps, 'createdAt'>,
    id?: EntityUniqueId,
  ) {
    const project = new Project(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return project;
  }

  get title() {
    return this.props.title;
  }

  set title(value: string) {
    this.props.title = value;
  }

  get topstory() {
    return this.props.topstory;
  }

  set topstory(value: string) {
    this.props.topstory = value;
  }

  get tags() {
    return this.props.tags;
  }

  set tags(value: string[]) {
    this.props.tags = value;
  }

  get links() {
    return this.props.links;
  }

  set links(value: string[]) {
    this.props.links = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
