import { PaginationParams } from '@/core/types/pagination-params';
import { Log, LogAction, LogTargetType } from '../entities/log';
import { LogWithAuthor } from '../entities/value-objects/log-with-author';
import { PaginationResponse } from '@/core/types/pagination-responses';

export interface LogsPaginationParams extends PaginationParams {
  action?: LogAction;
  targetType?: LogTargetType;
}

export abstract class ILogsRepository {
  abstract create(log: Log): Promise<void>;
  abstract findMany(params: LogsPaginationParams): Promise<Log[]>;
  abstract findManyWithAuthor(
    params: PaginationParams,
  ): Promise<PaginationResponse<LogWithAuthor>>;
}
