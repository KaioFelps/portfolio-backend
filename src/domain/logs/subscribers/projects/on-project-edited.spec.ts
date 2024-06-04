import { ProjectFactory } from 'test/factories/project-factory';
import { InMemoryLogsRepository } from 'test/repositories/in-memory-logs-repository';
import { InMemoryProjectsRepository } from 'test/repositories/in-memory-projects-repository';
import { waitFor } from 'test/utlils/wait-for';
import { MockInstance } from 'vitest';
import {
  CreateLogService,
  CreateLogServiceRequest,
  CreateLogServiceResponse,
} from '../../services/create-log-service';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { OnProjectEdited } from './on-project-edited';
import { InMemoryProjectTagsRepository } from 'test/repositories/in-memory-project-tags-repository';
import { InMemoryProjectLinksRepository } from 'test/repositories/in-memory-project-links-repository';

let inMemoryProjectsRepository: InMemoryProjectsRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryProjectTagsRepository: InMemoryProjectTagsRepository;
let inMemoryProjectLinksRepository: InMemoryProjectLinksRepository;

let createLogService: CreateLogService;

let registerEditedProjectSpy: MockInstance<
  [CreateLogServiceRequest],
  Promise<CreateLogServiceResponse>
>;

describe('On project edited subscriber', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryLogsRepository = new InMemoryLogsRepository(
      inMemoryUsersRepository,
    );

    inMemoryProjectTagsRepository = new InMemoryProjectTagsRepository();

    inMemoryProjectLinksRepository = new InMemoryProjectLinksRepository();

    inMemoryProjectsRepository = new InMemoryProjectsRepository(
      inMemoryProjectTagsRepository,
      inMemoryProjectLinksRepository,
    );

    createLogService = new CreateLogService(
      inMemoryLogsRepository,
      inMemoryUsersRepository,
    );

    registerEditedProjectSpy = vi.spyOn(createLogService, 'exec');

    new OnProjectEdited(createLogService);
  });

  it('should register a log when a project is edited', async () => {
    const project = ProjectFactory.exec();

    inMemoryProjectsRepository.items.push(project);

    project.title = 'título novo';
    project.addEditedEventToDispatch();
    inMemoryProjectsRepository.save(project);

    await waitFor(() => {
      expect(registerEditedProjectSpy).toHaveBeenCalled();
    });
  });
});
