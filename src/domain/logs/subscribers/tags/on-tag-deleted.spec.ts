import { InMemoryLogsRepository } from 'test/repositories/in-memory-logs-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { waitFor } from 'test/utlils/wait-for';
import { MockInstance } from 'vitest';
import {
  CreateLogService,
  CreateLogServiceRequest,
  CreateLogServiceResponse,
} from '../../services/create-log-service';
import { OnTagDeleted } from './on-tag-deleted';
import { TagFactory } from 'test/factories/tag-factory';
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryTagsRepository: InMemoryTagsRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;

let createLogService: CreateLogService;

let registerDeletedUserSpy: MockInstance<
  [CreateLogServiceRequest],
  Promise<CreateLogServiceResponse>
>;

describe('On tag deleted subscriber', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryTagsRepository = new InMemoryTagsRepository();

    inMemoryLogsRepository = new InMemoryLogsRepository(
      inMemoryUsersRepository,
    );

    createLogService = new CreateLogService(
      inMemoryLogsRepository,
      inMemoryUsersRepository,
    );

    registerDeletedUserSpy = vi.spyOn(createLogService, 'exec');

    new OnTagDeleted(createLogService);
  });

  it('should register a log when a tag is deleted', async () => {
    const tag = TagFactory.exec('editor');
    inMemoryTagsRepository.items.push(tag);

    tag.addDeletedEventToDispatch();
    inMemoryTagsRepository.delete(tag.id);

    await waitFor(() => {
      expect(registerDeletedUserSpy).toHaveBeenCalled();
    });
  });
});
