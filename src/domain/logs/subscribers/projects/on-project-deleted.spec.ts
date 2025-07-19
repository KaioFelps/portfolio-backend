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
import { OnProjectDeleted } from './on-project-deleted';
import { InMemoryProjectTagsRepository } from 'test/repositories/in-memory-project-tags-repository';
import { InMemoryProjectLinksRepository } from 'test/repositories/in-memory-project-links-repository';

let inMemoryProjectsRepository: InMemoryProjectsRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryProjectTagsRepository: InMemoryProjectTagsRepository;
let inMemoryProjectLinksRepository: InMemoryProjectLinksRepository;

let createLogService: CreateLogService;

let registerDeletedProjectSpy: MockInstance<
  (_: CreateLogServiceRequest) => Promise<CreateLogServiceResponse>
>;

describe('On project deleted subscriber', async () => {
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

    registerDeletedProjectSpy = vi.spyOn(createLogService, 'exec');

    new OnProjectDeleted(createLogService);
  });

  it('should register a log when a project is deleted', async () => {
    const project = ProjectFactory.exec();
    inMemoryProjectsRepository.items.push(project);

    project.addDeletedEventToDispatch();
    inMemoryProjectsRepository.delete(project);

    await waitFor(() => {
      expect(registerDeletedProjectSpy).toHaveBeenCalled();
    });
  });
});
