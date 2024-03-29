import { Project } from '../entities/project';
import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { EditProjectService } from './edit-project-service';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { InMemoryProjectLinksRepository } from 'test/repositories/in-memory-project-links-repository';
import { InMemoryProjectTagsRepository } from 'test/repositories/in-memory-project-tags-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { ProjectTagList } from '../entities/project-tag-link';
import { ProjectTag } from '../entities/project-tag';
import { UserFactory } from 'test/factories/user-factory';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { ProjectTagFactory } from 'test/factories/project-tag-factory';
import { ProjectLinkFactory } from 'test/factories/project-link-factory';
import { ProjectFactory } from 'test/factories/project-factory';

describe.only('Edit Project Service', () => {
  let sut: EditProjectService;
  let projectsRepository: InMemoryProjectsRepository;
  let projectLinksRepository: InMemoryProjectLinksRepository;
  let projectTagsRepository: InMemoryProjectTagsRepository;
  let userRepository: InMemoryUsersRepository;

  beforeEach(async () => {
    projectLinksRepository = new InMemoryProjectLinksRepository();

    projectTagsRepository = new InMemoryProjectTagsRepository();

    projectsRepository = new InMemoryProjectsRepository(
      projectTagsRepository,
      projectLinksRepository,
    );

    userRepository = new InMemoryUsersRepository();

    sut = new EditProjectService(
      projectsRepository,
      projectLinksRepository,
      projectTagsRepository,
      userRepository,
    );
  });

  it('should edit the tags and links if there is a change', async () => {
    const user = UserFactory.exec('admin');
    userRepository.items.push(user);

    const project = ProjectFactory.exec({
      title: 'initial title',
      topstory: 'initial_topstory_url.com',
    });

    projectsRepository.items.push(project);

    projectTagsRepository.items.push(
      ProjectTagFactory.exec(
        {
          projectId: project.id,
        },
        new EntityUniqueId('1'),
      ),
      ProjectTagFactory.exec(
        {
          projectId: project.id,
        },
        new EntityUniqueId('2'),
      ),
    );

    projectLinksRepository.items.push(
      ProjectLinkFactory.exec({
        projectId: project.id,
        value: 'github.com',
      }),
      ProjectLinkFactory.exec({
        projectId: project.id,
        value: 'bitbucket.com',
      }),
    );

    await sut.exec({
      projectId: project.id.toValue(),
      userId: user.id.toValue(),
      links: ['kaiofelps.dev'],
      tags: ['value-1', 'value-3'],
    });

    expect(projectsRepository.items[0].tags.getItems()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'value-1' }),
        expect.objectContaining({ value: 'value-3' }),
      ]),
    );

    expect(projectsRepository.items[0].links.getItems()).toEqual([
      expect.objectContaining({ value: 'kaiofelps.dev' }),
    ]);
  });

  it('should edit a project', async () => {
    const user = UserFactory.exec('admin');
    userRepository.items.push(user);

    const project = Project.create({
      title: 'testing project',
      topstory: '',
    });

    project.tags = new ProjectTagList([
      ProjectTag.create(
        {
          projectId: project.id,
          value: 'value-1',
        },
        new EntityUniqueId('1'),
      ),
    ]);

    projectsRepository.items.push(project);

    const result = await sut.exec({
      title: 'Novo título',
      projectId: project.id.toValue(),
      userId: user.id.toValue(),
    });

    expect(result.isOk()).toBe(true);

    expect(projectsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'Novo título',
      }),
    );
  });

  it("couldn't edit a question that doesn't exist", async () => {
    const user = UserFactory.exec('admin');
    userRepository.items.push(user);

    const result = await sut.exec({
      projectId: 'vsd',
      title: 'titulo',
      userId: user.id.toValue(),
    });

    expect(result.isFail()).toBe(true);

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
