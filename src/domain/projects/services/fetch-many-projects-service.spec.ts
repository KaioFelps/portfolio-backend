import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { ProjectFactory } from 'test/factories/project-factory';
import { FetchManyProjectsService } from './fetch-many-projects-service';
import { InMemoryProjectTagsRepository } from 'test/repositories/in-memory-project-tags-repository';
import { InMemoryProjectLinksRepository } from 'test/repositories/in-memory-project-links-repository';
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { ProjectTagList } from '../entities/project-tag-link';
import { ProjectTag } from '../entities/project-tag';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { randomUUID } from 'crypto';
import { Tag } from '@/core/entities/tag';

describe('Fetch Many Projects Service', () => {
  let sut: FetchManyProjectsService;
  let projectsRepository: InMemoryProjectsRepository;
  let projectTagsRepository: InMemoryProjectTagsRepository;
  let projectLinksRepository: InMemoryProjectLinksRepository;
  let tagsRepository: InMemoryTagsRepository;

  beforeEach(async () => {
    tagsRepository = new InMemoryTagsRepository();

    projectTagsRepository = new InMemoryProjectTagsRepository(tagsRepository);

    projectLinksRepository = new InMemoryProjectLinksRepository();

    projectsRepository = new InMemoryProjectsRepository(
      projectTagsRepository,
      projectLinksRepository,
      tagsRepository,
    );

    sut = new FetchManyProjectsService(projectsRepository);
  });

  it('should fetch projects that corresponds to the params', async () => {
    projectsRepository.items.push(
      ProjectFactory.exec({ title: 'design de fs' }),
    );

    const projectId = new EntityUniqueId(randomUUID());

    tagsRepository.items.push(
      Tag.create(
        {
          value: 'back-end',
        },
        new EntityUniqueId('1'),
      ),
      Tag.create(
        {
          value: 'teste',
        },
        new EntityUniqueId('2'),
      ),
    );

    projectsRepository.items.push(
      ProjectFactory.exec({
        tags: new ProjectTagList([
          ProjectTag.create({ projectId, tagId: new EntityUniqueId('1') }),
          ProjectTag.create({ projectId, tagId: new EntityUniqueId('2') }),
        ]),
        title: 'teste 1',
      }),
    );
    projectsRepository.items.push(
      ProjectFactory.exec({ title: 'designs e afins' }),
    );
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
