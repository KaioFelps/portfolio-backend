import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { Project, ProjectProps } from '@/domain/projects/entities/project';
import { ProjectLink } from '@/domain/projects/entities/project-link';
import { ProjectLinkList } from '@/domain/projects/entities/project-link-list';
import { ProjectTagList } from '@/domain/projects/entities/project-tag-link';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

export class ProjectFactory {
  static exec(
    override?: Optional<
      ProjectProps,
      'createdAt' | 'links' | 'tags' | 'title' | 'topstory'
    >,
    id?: EntityUniqueId,
  ) {
    const projectId = id ?? new EntityUniqueId(randomUUID());

    return Project.create(
      {
        links: new ProjectLinkList([
          ProjectLink.create({ value: faker.internet.url(), projectId }),
        ]),
        tags: new ProjectTagList(),
        title: faker.lorem.lines(1),
        topstory: '',
        createdAt: new Date(),
        ...override,
      },
      projectId,
    );
  }
}
