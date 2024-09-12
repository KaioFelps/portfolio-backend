import { InMemoryLogsRepository } from 'test/repositories/in-memory-logs-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { waitFor } from 'test/utlils/wait-for';
import { MockInstance } from 'vitest';
import {
  CreateLogService,
  CreateLogServiceRequest,
  CreateLogServiceResponse,
} from '../../services/create-log-service';
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { TagFactory } from 'test/factories/tag-factory';
import { OnTagEdited } from './on-tag-edited';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryTagsRepository: InMemoryTagsRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;

let createLogService: CreateLogService;

let registerEditedUserSpy: MockInstance<
  [CreateLogServiceRequest],
  Promise<CreateLogServiceResponse>
>;

describe('On user edited subscriber', async () => {
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

    registerEditedUserSpy = vi.spyOn(createLogService, 'exec');

    new OnTagEdited(createLogService);
  });

  it('should register a log when a user is edited', async () => {
    const tag = TagFactory.exec('rust');
    inMemoryTagsRepository.items.push(tag);

    tag.value = 'Rust';
    tag.addEditedEventToDispatch();

    inMemoryTagsRepository.save(tag);

    await waitFor(() => {
      expect(registerEditedUserSpy).toHaveBeenCalled();
    });
  });
});
