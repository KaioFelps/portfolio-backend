import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { PaginatedQueryDto } from '../dtos/paginated-query';
import { FetchManyLogsService } from '@/domain/logs/services/fetch-many-logs-service';
import { LogPresenter } from '../presenters/log-presenter';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';

@Controller('log')
export class LogController {
  constructor(private fetchManyLogsService: FetchManyLogsService) {}

  @Get('list')
  async getMany(@Query() query: PaginatedQueryDto) {
    const response = await this.fetchManyLogsService.exec(query);

    if (response.isFail()) {
      switch (response.value) {
        default:
          throw new InternalServerErrorException();
      }
    }

    const { count, logs } = response.value;
    const formattedLogs = logs.map(LogPresenter.toHTTP);

    return {
      logs: formattedLogs,
      totalCount: count,
      page: query.page ?? 1,
      perPage: query.amount ?? QUANTITY_PER_PAGE,
    };
  }
}
