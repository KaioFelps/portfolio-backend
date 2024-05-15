import { Injectable } from '@nestjs/common';
import { ILogsRepository } from '../repositories/logs-repository';
import { Either, ok } from '@/core/types/either';
import { PaginationParams } from '@/core/types/pagination-params';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { LogWithAuthor } from '../entities/value-objects/log-with-author';

interface FetchManyLogsServiceRequest extends PaginationParams {}

type FetchManyLogsServiceResponse = Either<
  null,
  { logs: LogWithAuthor[]; count: number }
>;

@Injectable()
export class FetchManyLogsService {
  constructor(private logsRepository: ILogsRepository) {}

  async exec({
    amount,
    page,
    query,
  }: FetchManyLogsServiceRequest): Promise<FetchManyLogsServiceResponse> {
    const { value, totalCount } = await this.logsRepository.findManyWithAuthor({
      amount: amount ?? QUANTITY_PER_PAGE,
      page: page ?? 1,
      query,
    });

    return ok({
      logs: value,
      count: totalCount,
    });
  }
}
