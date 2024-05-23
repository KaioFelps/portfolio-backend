import { Injectable } from '@nestjs/common';
import {
  ILogsRepository,
  LogsPaginationParams,
} from '../repositories/logs-repository';
import { Either, ok } from '@/core/types/either';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { LogWithAuthor } from '../entities/value-objects/log-with-author';

interface FetchManyLogsServiceRequest extends LogsPaginationParams {}

type FetchManyLogsServiceResponse = Either<
  null,
  { logs: LogWithAuthor[]; count: number }
>;

@Injectable()
export class FetchManyLogsService {
  constructor(private logsRepository: ILogsRepository) {}

  async exec(
    query: FetchManyLogsServiceRequest,
  ): Promise<FetchManyLogsServiceResponse> {
    query.amount = query.amount ?? QUANTITY_PER_PAGE;
    query.page = query.page ?? 1;

    const { value, totalCount } =
      await this.logsRepository.findManyWithAuthor(query);

    return ok({
      logs: value,
      count: totalCount,
    });
  }
}
