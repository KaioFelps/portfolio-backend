import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { ProjectFactory } from 'test/factories/project-factory';
import { FetchManyProjectsService } from './fetch-many-projects-service';
import { InMemoryProjectTagsRepository } from 'test/repositories/in-memory-project-tags-repository';
import { InMemoryProjectLinksRepository } from 'test/repositories/in-memory-project-links-repository';
import { ProjectTagList } from '../entities/project-tag-link';
import { ProjectTag } from '../entities/project-tag';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { randomUUID } from 'crypto';

describe('Fetch Many Projects Service', () => {
  let sut: FetchManyProjectsService;
  let projectsRepository: InMemoryProjectsRepository;
  let projectTagsRepository: InMemoryProjectTagsRepository;
  let projectLinksRepository: InMemoryProjectLinksRepository;

  beforeEach(async () => {
    projectTagsRepository = new InMemoryProjectTagsRepository();

    projectLinksRepository = new InMemoryProjectLinksRepository();

    projectsRepository = new InMemoryProjectsRepository(
      projectTagsRepository,
      projectLinksRepository,
    );

    sut = new FetchManyProjectsService(projectsRepository);
  });

  it('should fetch projects that corresponds to the params', async () => {
    projectsRepository.items.push(
      ProjectFactory.exec({ title: 'design de fs' }),
    );

    const projectId = new EntityUniqueId(randomUUID());

    projectsRepository.items.push(
      ProjectFactory.exec({
        tags: new ProjectTagList([
          ProjectTag.create(
            { projectId, value: 'tag-1' },
            new EntityUniqueId('1'),
          ),
          ProjectTag.create(
            { projectId, value: 'tag-2' },
            new EntityUniqueId('2'),
          ),
        ]),
        title: 'teste 1',
      }),
    );

    const projectWithDesignTag = ProjectFactory.exec({ title: 'teste-2' });
    projectWithDesignTag.tags = new ProjectTagList([
      ProjectTag.create({
        value: 'design',
        projectId: projectWithDesignTag.id,
      }),
    ]);
    projectsRepository.items.push(projectWithDesignTag);

    projectsRepository.items.push(ProjectFactory.exec({ title: 'teste 3' }));
    projectsRepository.items.push(ProjectFactory.exec({ title: 'teste 4' }));

    let result = await sut.exec({
      page: 2,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    expect(result.value.projects.length).toBe(2);

    result = await sut.exec({
      page: 1,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    expect(result.value.projects.length).toBe(3);

    result = await sut.exec({
      page: 1,
      amount: 3,
      query: 'design',
    });

    expect(result.isOk()).toBe(true);
    expect(result.value.projects.length).toBe(2);
  });
});
