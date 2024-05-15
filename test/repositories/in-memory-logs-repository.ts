import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { PaginationParams } from '@/core/types/pagination-params';
import { PaginationResponse } from '@/core/types/pagination-responses';
import { Log } from '@/domain/logs/entities/log';
import { LogWithAuthor } from '@/domain/logs/entities/value-objects/log-with-author';
import { ILogsRepository } from '@/domain/logs/repositories/logs-repository';
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
  }: PaginationParams): Promise<Log[]> {
    let logs: Log[] = [];

    if (query) {
      logs = this.items.filter((item) => {
        if (item.action.includes(query.trim())) {
          return item;
        }

        if (item.target === query) {
          return item;
        }

        if (
          item.dispatcherId &&
          item.dispatcherId.equals(new EntityUniqueId(query))
        ) {
          return item;
        }

        return null;
      });
    } else {
      logs = this.items;
    }

    logs = logs.slice((page - 1) * itemsPerPage, itemsPerPage * page);

    return logs;
  }

  async findManyWithAuthor({
    query,
    amount: itemsPerPage = QUANTITY_PER_PAGE,
    page = 1,
  }: PaginationParams): Promise<PaginationResponse<LogWithAuthor>> {
    let logs: Log[] = [];

    if (query) {
      logs = this.items.filter((item) => {
        if (item.action.includes(query.trim())) {
          return item;
        }

        if (item.target === query) {
          return item;
        }

        if (
          item.dispatcherId &&
          item.dispatcherId.equals(new EntityUniqueId(query))
        ) {
          return item;
        }

        return null;
      });
    } else {
      logs = this.items;
    }

    logs = logs.slice((page - 1) * itemsPerPage, itemsPerPage * page);

    const logsWithAuthor: LogWithAuthor[] = [];

    logs.forEach(async (log) => {
      logsWithAuthor.push(
        LogWithAuthor.create({
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
