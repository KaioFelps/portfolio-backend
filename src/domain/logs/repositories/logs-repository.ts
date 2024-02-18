import { PaginationParams } from '@/core/types/pagination-params';
import { Log } from '../entities/log';

export abstract class ILogsRepository {
  abstract create(log: Log): Promise<void>;
  abstract findMany(params: PaginationParams): Promise<Log[]>;
}
