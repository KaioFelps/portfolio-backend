import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { ProjectFactory } from 'test/factories/project-factory';
import { FetchManyProjectsService } from './fetch-many-projects-service';
import { InMemoryProjectTagsRepository } from 'test/repositories/in-memory-project-tags-repository';
import { InMemoryProjectLinksRepository } from 'test/repositories/in-memory-project-links-repository';
import { ProjectTagList } from '../entities/project-tag-list';
import { ProjectTag } from '../entities/project-tag';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { randomUUID } from 'crypto';
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { TagFactory } from 'test/factories/tag-factory';

describe('Fetch Many Projects Service', () => {
  let sut: FetchManyProjectsService;
  let tagsRepository: InMemoryTagsRepository;
  let projectsRepository: InMemoryProjectsRepository;
  let projectTagsRepository: InMemoryProjectTagsRepository;
  let projectLinksRepository: InMemoryProjectLinksRepository;

  beforeAll(async () => {
    tagsRepository = new InMemoryTagsRepository();
    projectTagsRepository = new InMemoryProjectTagsRepository();
    projectLinksRepository = new InMemoryProjectLinksRepository();
    projectsRepository = new InMemoryProjectsRepository(
      projectTagsRepository,
      projectLinksRepository,
    );

    sut = new FetchManyProjectsService(projectsRepository, tagsRepository);
  });

  beforeAll(async () => {
    const tag1 = TagFactory.exec({ value: 'tag-1' });
    const tag2 = TagFactory.exec({ value: 'tag-2' });
    const tag3 = TagFactory.exec({ value: 'design' });
    tagsRepository.items.push(tag1, tag2, tag3);

    const project1Tags1And2Id = new EntityUniqueId(randomUUID());
    const projectWithTags1And2 = ProjectFactory.exec({
      tags: new ProjectTagList([
        ProjectTag.create(
          { projectId: project1Tags1And2Id, tag: tag1 },
          new EntityUniqueId('1'),
        ),
        ProjectTag.create(
          { projectId: project1Tags1And2Id, tag: tag2 },
          new EntityUniqueId('2'),
        ),
      ]),
      title: 'teste 1',
    });
    projectsRepository.items.push(projectWithTags1And2);

    const projectWithDesignTag = ProjectFactory.exec({ title: 'teste-2' });
    projectWithDesignTag.tags = new ProjectTagList([
      ProjectTag.create({
        tag: tag3,
        projectId: projectWithDesignTag.id,
      }),
    ]);
    projectsRepository.items.push(projectWithDesignTag);

    projectsRepository.items.push(ProjectFactory.exec({ title: 'teste 3' }));
    projectsRepository.items.push(ProjectFactory.exec({ title: 'teste 4' }));
    projectsRepository.items.push(
      ProjectFactory.exec({ title: 'design de fs' }),
    );

    // adds 5 projects in total
  });

  test('pagination and amount query parameters', async () => {
    const result = await sut.exec({
      page: 2,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) expect(result.value.projects.length).toBe(2);
  });

  test('tag query parameter', async () => {
    const result = await sut.exec({
      page: 1,
      amount: 3,
      tag: 'design',
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) expect(result.value.projects.length).toBe(1);
  });

  test('title query parameter', async () => {
    const result = await sut.exec({
      title: 'teste',
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.count).toBe(4);
      expect(result.value.projects.length).toBe(3);
    }
  });
});
