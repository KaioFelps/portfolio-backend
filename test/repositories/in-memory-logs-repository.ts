import { PaginationResponse } from '@/core/types/pagination-responses';
import { Log } from '@/domain/logs/entities/log';
import { LogWithAuthor } from '@/domain/logs/entities/value-objects/log-with-author';
import {
  ILogsRepository,
  LogsPaginationParams,
} from '@/domain/logs/repositories/logs-repository';
import { InMemoryUsersRepository } from './in-memory-users-repository';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';

export class InMemoryLogsRepository implements ILogsRepository {
  public items: Log[] = [];

  constructor(private inMemoryUsersRepository: InMemoryUsersRepository) {}

  async create(log: Log): Promise<void> {
    this.items.push(log);
  }

  async findMany({
    amount: itemsPerPage = QUANTITY_PER_PAGE,
    page = 1,
    query,
    action,
    targetType,
  }: LogsPaginationParams): Promise<Log[]> {
    let logs: Log[] = this.items.filter((item) => {
      const author = item.dispatcherId
        ? this.inMemoryUsersRepository.items.find((user) =>
            user.id.equals(item.dispatcherId!),
          )
        : null;

      if (
        query &&
        !item.target.includes(query) &&
        !author?.name.includes(query)
      )
        return null;

      if (action && item.action !== action) return null;

      if (targetType && item.targetType !== targetType) return null;

      return item;
    });

    logs = logs.slice((page - 1) * itemsPerPage, itemsPerPage * page);

    return logs;
  }

  async findManyWithAuthor({
    query,
    amount: itemsPerPage = QUANTITY_PER_PAGE,
    page = 1,
    action,
    targetType,
  }: LogsPaginationParams): Promise<PaginationResponse<LogWithAuthor>> {
    let logs: Log[] = this.items.filter((item) => {
      const author = item.dispatcherId
        ? this.inMemoryUsersRepository.items.find((user) =>
            user.id.equals(item.dispatcherId!),
          )
        : null;

      if (
        query &&
        !item.target.includes(query) &&
        !author?.name.includes(query)
      )
        return null;

      if (action && item.action !== action) return null;

      if (targetType && item.targetType !== targetType) return null;

      return item;
    });

    logs = logs.slice((page - 1) * itemsPerPage, itemsPerPage * page);

    const logsWithAuthor: LogWithAuthor[] = [];

    logs.forEach(async (log) => {
      logsWithAuthor.push(
        LogWithAuthor.create({
          id: log.id,
          action: log.action,
          createdAt: log.createdAt,
          target: log.target,
          targetType: log.targetType,
          dispatcher: log.dispatcherId
            ? await this.inMemoryUsersRepository.findById(
                log.dispatcherId.toValue(),
              )
            : null,
        }),
      );
    });

    const totalCount = logs.length;

    return {
      value: await logsWithAuthor,
      totalCount,
    };
  }
}
