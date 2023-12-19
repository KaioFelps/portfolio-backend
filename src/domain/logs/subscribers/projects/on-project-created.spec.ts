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
import { OnProjectCreated } from './on-project-created';

let inMemoryProjectsRepository: InMemoryProjectsRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

let createLogService: CreateLogService;

let registerCreatedProjectSpy: MockInstance<
  [CreateLogServiceRequest],
  Promise<CreateLogServiceResponse>
>;

describe('On project created subscriber', async () => {
  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository();
    inMemoryLogsRepository = new InMemoryLogsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createLogService = new CreateLogService(
      inMemoryLogsRepository,
      inMemoryUsersRepository,
    );

    registerCreatedProjectSpy = vi.spyOn(createLogService, 'exec');

    new OnProjectCreated(createLogService);
  });

  it('should register a log when a project is created', async () => {
    const project = ProjectFactory.exec();

    inMemoryProjectsRepository.create(project);

    await waitFor(() => {
      expect(registerCreatedProjectSpy).toHaveBeenCalled();
    });
  });
});
