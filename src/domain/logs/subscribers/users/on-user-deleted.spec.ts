import { UserFactory } from 'test/factories/user-factory';
import { InMemoryLogsRepository } from 'test/repositories/in-memory-logs-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { waitFor } from 'test/utlils/wait-for';
import { MockInstance } from 'vitest';
import {
  CreateLogService,
  CreateLogServiceRequest,
  CreateLogServiceResponse,
} from '../../services/create-log-service';
import { OnUserDeleted } from './on-user-deleted';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;

let createLogService: CreateLogService;

let registerDeletedUserSpy: MockInstance<
  [CreateLogServiceRequest],
  Promise<CreateLogServiceResponse>
>;

describe('On user deleted subscriber', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryLogsRepository = new InMemoryLogsRepository(
      inMemoryUsersRepository,
    );

    createLogService = new CreateLogService(
      inMemoryLogsRepository,
      inMemoryUsersRepository,
    );

    registerDeletedUserSpy = vi.spyOn(createLogService, 'exec');

    new OnUserDeleted(createLogService);
  });

  it('should register a log when a user is deleted', async () => {
    const admin = UserFactory.exec('admin');
    const user = UserFactory.exec('editor');
    inMemoryUsersRepository.items.push(admin);
    inMemoryUsersRepository.items.push(user);

    user.addDeletedEventToDispatch(admin.id);
    inMemoryUsersRepository.delete(user);

    await waitFor(() => {
      expect(registerDeletedUserSpy).toHaveBeenCalled();
    });
  });
});
