import { Injectable } from '@nestjs/common';
import { ILogsRepository } from '../repositories/logs-repository';
import { Either, ok } from '@/core/types/either';
import { PaginationParams } from '@/core/types/pagination-params';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Log } from '../entities/log';

interface FetchManyLogsServiceRequest extends PaginationParams {}

type FetchManyLogsServiceResponse = Either<null, { logs: Log[] }>;

@Injectable()
export class FetchManyLogsService {
  constructor(private logsRepository: ILogsRepository) {}

  async exec({
    amount,
    page,
    query,
  }: FetchManyLogsServiceRequest): Promise<FetchManyLogsServiceResponse> {
    const logs = await this.logsRepository.findMany({
      amount: amount ?? QUANTITY_PER_PAGE,
      page: page ?? 1,
      query,
    });

    return ok({
      logs,
    });
  }
}
