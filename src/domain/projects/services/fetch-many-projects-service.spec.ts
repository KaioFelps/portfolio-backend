import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { ProjectFactory } from 'test/factories/project-factory';
import { FetchManyProjectsService } from './fetch-many-projects-service';

describe('Fetch Many Projects Service', () => {
  let sut: FetchManyProjectsService;
  let projectsRepository: InMemoryProjectsRepository;

  beforeEach(async () => {
    projectsRepository = new InMemoryProjectsRepository();
    sut = new FetchManyProjectsService(projectsRepository);
  });

  it('should fetch projects that corresponds to the params', async () => {
    projectsRepository.items.push(
      ProjectFactory.exec({ tags: [], title: 'design de fs' }),
    );
    projectsRepository.items.push(
      ProjectFactory.exec({ tags: ['design', 'back-end'], title: 'teste 1' }),
    );
    projectsRepository.items.push(
      ProjectFactory.exec({ tags: [], title: 'teste 2' }),
    );
    projectsRepository.items.push(
      ProjectFactory.exec({ tags: [], title: 'teste 3' }),
    );
    projectsRepository.items.push(
      ProjectFactory.exec({ tags: [], title: 'teste 4' }),
    );

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
