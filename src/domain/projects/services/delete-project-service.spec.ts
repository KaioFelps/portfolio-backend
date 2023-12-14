import { Project } from '../entities/project';
import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeleteProjectService } from './delete-project-service';

describe('Delete Project Service', () => {
  let sut: DeleteProjectService;
  let projectsRepository: InMemoryProjectsRepository;

  beforeEach(async () => {
    projectsRepository = new InMemoryProjectsRepository();
    sut = new DeleteProjectService(projectsRepository);
  });

  it('should delete a project if exists', async () => {
    const project = Project.create({
      title: 'testing project',
      links: [],
      tags: ['back-end'],
      topstory: '',
    });

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
