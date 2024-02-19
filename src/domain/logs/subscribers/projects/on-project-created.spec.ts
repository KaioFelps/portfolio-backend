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
import { InMemoryProjectTagsRepository } from 'test/repositories/in-memory-project-tags-repository';
import { InMemoryProjectLinksRepository } from 'test/repositories/in-memory-project-links-repository';
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';

let inMemoryProjectsRepository: InMemoryProjectsRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryProjectTagsRepository: InMemoryProjectTagsRepository;
let inMemoryProjectLinksRepository: InMemoryProjectLinksRepository;
let inMemoryTagsRepository: InMemoryTagsRepository;

let createLogService: CreateLogService;

let registerCreatedProjectSpy: MockInstance<
  [CreateLogServiceRequest],
  Promise<CreateLogServiceResponse>
>;

describe('On project created subscriber', async () => {
  beforeEach(() => {
    inMemoryLogsRepository = new InMemoryLogsRepository();

    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryTagsRepository = new InMemoryTagsRepository();

    inMemoryProjectTagsRepository = new InMemoryProjectTagsRepository(
      inMemoryTagsRepository,
    );

    inMemoryProjectLinksRepository = new InMemoryProjectLinksRepository();

    inMemoryProjectsRepository = new InMemoryProjectsRepository(
      inMemoryProjectTagsRepository,
      inMemoryProjectLinksRepository,
      inMemoryTagsRepository,
    );

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
