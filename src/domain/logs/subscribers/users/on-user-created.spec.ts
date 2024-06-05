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
import { OnUserCreated } from './on-user-created';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;

let createLogService: CreateLogService;

let registerCreatedUserSpy: MockInstance<
  [CreateLogServiceRequest],
  Promise<CreateLogServiceResponse>
>;

describe('On user created subscriber', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryLogsRepository = new InMemoryLogsRepository(
      inMemoryUsersRepository,
    );

    createLogService = new CreateLogService(
      inMemoryLogsRepository,
      inMemoryUsersRepository,
    );

    registerCreatedUserSpy = vi.spyOn(createLogService, 'exec');

    new OnUserCreated(createLogService);
  });

  it('should register a log when a user is created', async () => {
    const admin = UserFactory.exec('admin');
    inMemoryUsersRepository.items.push(admin);

    const user = UserFactory.exec('editor');

    user.addCreatedEventToDispatch(admin.id);
    inMemoryUsersRepository.create(user);

    await waitFor(() => {
      expect(registerCreatedUserSpy).toHaveBeenCalled();
    });
  });
});
