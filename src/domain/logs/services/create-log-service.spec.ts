import { CreateLogService } from './create-log-service';
import { LogAction, LogTarget } from '../entities/log';
import { UserFactory } from 'test/factories/user-factory';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryLogsRepository } from 'test/repositories/in-memory-logs-repository';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { BadRequestError } from '@/core/errors/bad-request-error';

describe('Create Log Service', () => {
  let sut: CreateLogService;
  let logsRepository: InMemoryLogsRepository;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(async () => {
    logsRepository = new InMemoryLogsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateLogService(logsRepository, usersRepository);
  });

  it('should create a log', async () => {
    const user = UserFactory.exec('editor');

    usersRepository.items.push(user);

    const result = await sut.exec({
      action: LogAction.created,
      target: LogTarget.project,
      dispatcherId: user.id,
    });

    expect(result.isOk()).toBe(true);

    expect(logsRepository.items[0]).toEqual(
      expect.objectContaining({
        action: LogAction.created,
        target: LogTarget.project,
        dispatcherId: user.id,
      }),
    );
  });

  it("shouldn't create a log without a valid dispatcher id", async () => {
    const result = await sut.exec({
      action: LogAction.created,
      target: LogTarget.project,
      dispatcherId: new EntityUniqueId('pseudo-id'),
    });

    expect(result.isFail()).toBe(true);

    expect(result.value).toBeInstanceOf(BadRequestError);
  });
});
