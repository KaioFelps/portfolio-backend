import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { ProjectFactory } from 'test/factories/project-factory';
import { GetProjectByIdService } from './get-project-by-id-service';
import { InMemoryProjectLinksRepository } from 'test/repositories/in-memory-project-links-repository';
import { InMemoryProjectTagsRepository } from 'test/repositories/in-memory-project-tags-repository';

describe('Change Project Visibility Service', () => {
  let sut: GetProjectByIdService;
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
    sut = new GetProjectByIdService(projectsRepository);
  });

  it('should get a post by id if post exists', async () => {
    const project = ProjectFactory.exec();
    projectsRepository.items.push(project);

    const result = await sut.exec({ id: project.id.toValue() });

    expect(result.isOk());
    expect(result.value?.project).not.toBeNull();
  });
});
