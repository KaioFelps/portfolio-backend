import { Optional } from '@/core/types/optional';
import { Project, ProjectProps } from '@/domain/projects/entities/project';
import { faker } from '@faker-js/faker';

export class ProjectFactory {
  static exec(
    override?: Optional<
      ProjectProps,
      'createdAt' | 'links' | 'tags' | 'title' | 'topstory'
    >,
  ) {
    return Project.create({
      links: [faker.internet.url()],
      tags: faker.word.words(3).split(' '),
      title: faker.lorem.lines(1),
      topstory: '',
      createdAt: new Date(),
      ...override,
    });
  }
}
