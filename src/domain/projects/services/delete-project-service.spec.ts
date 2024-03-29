import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeleteProjectService } from './delete-project-service';
import { InMemoryProjectLinksRepository } from 'test/repositories/in-memory-project-links-repository';
import { InMemoryProjectTagsRepository } from 'test/repositories/in-memory-project-tags-repository';
import { ProjectLinkList } from '../entities/project-link-list';
import { ProjectTagList } from '../entities/project-tag-link';
import { ProjectTagFactory } from 'test/factories/project-tag-factory';
import { ProjectFactory } from 'test/factories/project-factory';

describe('Delete Project Service', () => {
  let sut: DeleteProjectService;
  let projectsRepository: InMemoryProjectsRepository;
  let projectLinksRepository: InMemoryProjectLinksRepository;
  let projectTagsRepository: InMemoryProjectTagsRepository;

  beforeEach(async () => {
    projectLinksRepository = new InMemoryProjectLinksRepository();

    projectTagsRepository = new InMemoryProjectTagsRepository();

    projectsRepository = new InMemoryProjectsRepository(
      projectTagsRepository,
      projectLinksRepository,
    );

    sut = new DeleteProjectService(projectsRepository);
  });

  it('should delete a project if exists', async () => {
    const project = ProjectFactory.exec({
      title: 'testing project',
      links: new ProjectLinkList(),
      topstory: '',
    });

    project.tags = new ProjectTagList([
      ProjectTagFactory.exec({ value: 'back-end', projectId: project.id }),
    ]);

    projectsRepository.items.push(project);

    const result = await sut.exec({
      projectId: project.id.toValue(),
    });

    expect(result.isOk()).toBe(true);

    expect(projectsRepository.items.length).toBe(0);
  });

  it("shouldn't delete a question that doesn't exist", async () => {
    const result = await sut.exec({
      projectId: 'vsd',
    });

    expect(result.isFail()).toBe(true);

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
