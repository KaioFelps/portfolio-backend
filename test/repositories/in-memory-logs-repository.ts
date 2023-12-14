import { Log } from '@/domain/logs/entities/log';
import { ILogsRepository } from '@/domain/logs/repositories/logs-repository';

export class InMemoryLogsRepository implements ILogsRepository {
  public items: Log[] = [];

  async create(log: Log): Promise<void> {
    this.items.push(log);
  }
}
