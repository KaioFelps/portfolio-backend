import { TagFactory } from 'test/factories/tag-factory';
import { InMemoryLogsRepository } from 'test/repositories/in-memory-logs-repository';
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { waitFor } from 'test/utlils/wait-for';
import { MockInstance } from 'vitest';
import {
  CreateLogService,
  CreateLogServiceRequest,
  CreateLogServiceResponse,
} from '../../services/create-log-service';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { OnTagCreated } from './on-tag-created';

let inMemoryTagsRepository: InMemoryTagsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;

let createLogService: CreateLogService;

let registerCreatedTagSpy: MockInstance<
  (_: CreateLogServiceRequest) => Promise<CreateLogServiceResponse>
>;

describe('On tag created subscriber', async () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryTagsRepository = new InMemoryTagsRepository();
    inMemoryLogsRepository = new InMemoryLogsRepository(inMemoryUserRepository);

    createLogService = new CreateLogService(
      inMemoryLogsRepository,
      inMemoryUserRepository,
    );

    registerCreatedTagSpy = vi.spyOn(createLogService, 'exec');

    new OnTagCreated(createLogService);
  });

  it('should register a log when a tag is created', async () => {
    const admin = TagFactory.exec('admin');
    inMemoryTagsRepository.items.push(admin);

    const tag = TagFactory.exec('editor');

    tag.addCreatedEventToDispatch();
    inMemoryTagsRepository.create(tag);

    await waitFor(() => {
      expect(registerCreatedTagSpy).toHaveBeenCalled();
    });
  });
});
