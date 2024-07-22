import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeleteProjectService } from './delete-project-service';
import { InMemoryProjectLinksRepository } from 'test/repositories/in-memory-project-links-repository';
import { InMemoryProjectTagsRepository } from 'test/repositories/in-memory-project-tags-repository';
import { ProjectLinkList } from '../entities/project-link-list';
import { ProjectTagList } from '../entities/project-tag-list';
import { ProjectTagFactory } from 'test/factories/project-tag-factory';
import { ProjectFactory } from 'test/factories/project-factory';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/user-factory';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { TagFactory } from 'test/factories/tag-factory';

describe('Delete Project Service', () => {
  let sut: DeleteProjectService;
  let projectsRepository: InMemoryProjectsRepository;
  let tagsRepository: InMemoryTagsRepository;
  let projectLinksRepository: InMemoryProjectLinksRepository;
  let projectTagsRepository: InMemoryProjectTagsRepository;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(async () => {
    tagsRepository = new InMemoryTagsRepository();
    projectLinksRepository = new InMemoryProjectLinksRepository();
    projectTagsRepository = new InMemoryProjectTagsRepository();
    projectsRepository = new InMemoryProjectsRepository(
      projectTagsRepository,
      projectLinksRepository,
    );
    usersRepository = new InMemoryUsersRepository();

    sut = new DeleteProjectService(projectsRepository, usersRepository);
  });

  it('should delete a project if exists', async () => {
    const project = ProjectFactory.exec({
      title: 'testing project',
      links: new ProjectLinkList(),
      topstory: '',
    });

    const tag = TagFactory.exec();
    tagsRepository.items.push(tag);

    project.tags = new ProjectTagList([
      ProjectTagFactory.exec({
        tag,
        projectId: project.id,
      }),
    ]);

    projectsRepository.items.push(project);

    const user = UserFactory.exec('admin');
    usersRepository.items.push(user);

    const result = await sut.exec({
      projectId: project.id.toValue(),
      userId: user.id.toValue(),
    });

    expect(result.isOk()).toBe(true);

    expect(projectsRepository.items.length).toBe(0);
  });

  it("shouldn't delete a project that doesn't exist", async () => {
    const user = UserFactory.exec('admin');
    usersRepository.items.push(user);

    const result = await sut.exec({
      projectId: 'vsd',
      userId: user.id.toValue(),
    });

    expect(result.isFail()).toBe(true);

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("shouldn't let a non-admin user deledte a project.", async () => {
    const project = ProjectFactory.exec({
      title: 'testing project',
      links: new ProjectLinkList(),
      topstory: '',
    });

    const tag = TagFactory.exec({ value: 'back-end' });
    tagsRepository.items.push(tag);

    project.tags = new ProjectTagList([
      ProjectTagFactory.exec({ tag, projectId: project.id }),
    ]);

    projectsRepository.items.push(project);

    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const result = await sut.exec({
      projectId: project.id.toValue(),
      userId: user.id.toValue(),
    });

    expect(result.isFail()).toBe(true);
    expect(result.value).toBeInstanceOf(UnauthorizedError);
    expect(projectsRepository.items.length).toBe(1);
  });
});
