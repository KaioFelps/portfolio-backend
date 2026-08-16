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
import { OnUserEdited } from './on-user-edited';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryLogsRepository: InMemoryLogsRepository;

let createLogService: CreateLogService;

let registerEditedUserSpy: MockInstance<
  (_: CreateLogServiceRequest) => Promise<CreateLogServiceResponse>
>;

describe('On user edited subscriber', async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    inMemoryLogsRepository = new InMemoryLogsRepository(
      inMemoryUsersRepository,
    );

    createLogService = new CreateLogService(
      inMemoryLogsRepository,
      inMemoryUsersRepository,
    );

    registerEditedUserSpy = vi.spyOn(createLogService, 'exec');

    new OnUserEdited(createLogService);
  });

  it('should register a log when a user is edited', async () => {
    const admin = UserFactory.exec('admin');
    const user = UserFactory.exec('admin');
    inMemoryUsersRepository.items.push(user);
    inMemoryUsersRepository.items.push(admin);

    user.name = 'Novo nome';
    user.addEditedEventToDispatch(admin.id);

    inMemoryUsersRepository.save(user);

    await waitFor(() => {
      expect(registerEditedUserSpy).toHaveBeenCalled();
    });
  });
});
