import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { Project, ProjectProps } from '@/domain/projects/entities/project';
import { ProjectLinkList } from '@/domain/projects/entities/project-link-list';
import { ProjectTagList } from '@/domain/projects/entities/project-tag-link';
import { faker } from '@faker-js/faker';

export class ProjectFactory {
  static exec(
    override?: Optional<
      ProjectProps,
      'createdAt' | 'links' | 'tags' | 'title' | 'topstory'
    >,
    id?: EntityUniqueId,
  ) {
    return Project.create(
      {
        links: new ProjectLinkList(),
        tags: new ProjectTagList(),
        title: faker.lorem.lines(1),
        topstory: '',
        createdAt: new Date(),
        ...override,
      },
      id,
    );
  }
}
