import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { CreateProjectService } from './create-project-service';
import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { UserFactory } from 'test/factories/user-factory';

describe('Create Project Service', () => {
  let sut: CreateProjectService;
  let projectsRepository: InMemoryProjectsRepository;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(async () => {
    projectsRepository = new InMemoryProjectsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateProjectService(projectsRepository, usersRepository);
  });

  it('should create a project', async () => {
    const user = UserFactory.exec('admin');
    usersRepository.items.push(user);

    const result = await sut.exec({
      title: 'testing project',
      links: [],
      tags: ['back-end'],
      topstory: '',
      userId: user.id.toValue(),
    });

    expect(result.isOk()).toBe(true);

    expect(projectsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'testing project',
      }),
    );
  });
});
