import { PaginationParams } from '@/core/types/pagination-params';
import { Log } from '../entities/log';
import { LogWithAuthor } from '../entities/value-objects/log-with-author';
import { PaginationResponse } from '@/core/types/pagination-responses';

export abstract class ILogsRepository {
  abstract create(log: Log): Promise<void>;
  abstract findMany(params: PaginationParams): Promise<Log[]>;
  abstract findManyWithAuthor(
    params: PaginationParams,
  ): Promise<PaginationResponse<LogWithAuthor>>;
}
