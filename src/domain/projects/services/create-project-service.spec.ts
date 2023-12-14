import { CreateProjectService } from './create-project-service';
import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';

describe('Create Project Service', () => {
  let sut: CreateProjectService;
  let projectsRepository: InMemoryProjectsRepository;

  beforeEach(async () => {
    projectsRepository = new InMemoryProjectsRepository();
    sut = new CreateProjectService(projectsRepository);
  });

  it('should create a project', async () => {
    const result = await sut.exec({
      title: 'testing project',
      links: [],
      tags: ['back-end'],
      topstory: '',
    });

    expect(result.isOk()).toBe(true);

    expect(projectsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'testing project',
      }),
    );
  });
});
