import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { PaginationParams } from '@/core/types/pagination-params';
import { Log } from '@/domain/logs/entities/log';
import { ILogsRepository } from '@/domain/logs/repositories/logs-repository';

export class InMemoryLogsRepository implements ILogsRepository {
  public items: Log[] = [];

  async create(log: Log): Promise<void> {
    this.items.push(log);
  }

  async findMany({
    amount: itemsPerPage = 9,
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
}
