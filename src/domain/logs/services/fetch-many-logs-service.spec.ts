import { InMemoryLogsRepository } from 'test/repositories/in-memory-logs-repository';
import { LogFactory } from 'test/factories/log-factory';
import { FetchManyLogsService } from './fetch-many-logs-service';
import { LogAction, LogTargetType } from '../entities/log';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

describe('Fetch Many Logs Service', () => {
  let sut: FetchManyLogsService;
  let usersRepository: InMemoryUsersRepository;
  let logsRepository: InMemoryLogsRepository;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    logsRepository = new InMemoryLogsRepository(usersRepository);
    sut = new FetchManyLogsService(logsRepository);
  });

  it('should fetch logs that corresponds to the params', async () => {
    logsRepository.items.push(
      LogFactory.exec({
        action: LogAction.deleted,
        targetType: LogTargetType.project,
      }),
    );

    logsRepository.items.push(LogFactory.exec({ action: LogAction.created }));
    logsRepository.items.push(LogFactory.exec({ action: LogAction.created }));
    logsRepository.items.push(LogFactory.exec({ action: LogAction.created }));

    logsRepository.items.push(
      LogFactory.exec({
        target: 'Hidro mourão',
        targetType: LogTargetType.project,
      }),
    );

    let result = await sut.exec({
      page: 2,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    expect(
      result.value!.logs.length,
      'primeira resposta deveria ter 2 logs.',
    ).toBe(2);

    result = await sut.exec({
      page: 1,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    expect(
      result.value!.logs.length,
      'penúltima resposta deveria ter 3 logs.',
    ).toBe(3);

    result = await sut.exec({
      page: 1,
      amount: 3,
      action: LogAction.deleted,
    });

    expect(result.isOk()).toBe(true);
    expect(
      result.value!.logs.length,
      'última resposta deveria ter 1 log somente.',
    ).toBe(1);
  });
});
