import { Project } from '../entities/project';
import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { EditProjectService } from './edit-project-service';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

describe('Edit Project Service', () => {
  let sut: EditProjectService;
  let projectsRepository: InMemoryProjectsRepository;

  beforeEach(async () => {
    projectsRepository = new InMemoryProjectsRepository();
    sut = new EditProjectService(projectsRepository);
  });

  it('should edit a project', async () => {
    const project = Project.create({
      title: 'testing project',
      links: [],
      tags: ['back-end'],
      topstory: '',
    });

    projectsRepository.items.push(project);

    const result = await sut.exec({
      title: 'Novo título',
      projectId: project.id.toValue(),
    });

    expect(result.isOk()).toBe(true);

    expect(projectsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'Novo título',
      }),
    );
  });

  it("couldn't edit a question that doesn't exist", async () => {
    const result = await sut.exec({
      projectId: 'vsd',
      title: 'titulo',
    });

    expect(result.isFail()).toBe(true);

    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
