import { Aggregate } from '@/core/entities/aggregate';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { ProjectCreatedEvent } from '../events/project-created-event';
import { ProjectLinkList } from './project-link-list';
import { ProjectTagList } from './project-tag-link';

export interface ProjectProps {
  title: string;
  topstory: string;
  tags: ProjectTagList;
  links: ProjectLinkList;
  createdAt: Date;
}

export class Project extends Aggregate<ProjectProps> {
  constructor(props: ProjectProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(
    props: Optional<ProjectProps, 'createdAt' | 'links' | 'tags'>,
    id?: EntityUniqueId,
  ) {
    const project = new Project(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        links: props.links ?? new ProjectLinkList(),
        tags: props.tags ?? new ProjectTagList(),
      },
      id,
    );

    const projectIsNew = !id;

    if (projectIsNew) {
      project.addDomainEvent(new ProjectCreatedEvent(project));
    }

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

  set tags(value: ProjectTagList) {
    this.props.tags = value;
  }

  get links() {
    return this.props.links;
  }

  set links(value: ProjectLinkList) {
    this.props.links = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
