import { PaginationResponse } from '@/core/types/pagination-responses';
import { Log } from '@/domain/logs/entities/log';
import { LogWithAuthor } from '@/domain/logs/entities/value-objects/log-with-author';
import {
  ILogsRepository,
  LogsPaginationParams,
} from '@/domain/logs/repositories/logs-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { PrismaLogMapper } from '../mappers/prisma-log-mapper';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaLogsRepository implements ILogsRepository {
  constructor(private prisma: PrismaService) {}

  async create(log: Log): Promise<void> {
    await this.prisma.log.create(PrismaLogMapper.toPrisma(log));
  }

  async findMany({
    amount: PER_PAGE = QUANTITY_PER_PAGE,
    page = 1,
    query,
    action: queryAction,
    targetType: queryTargetType,
  }: LogsPaginationParams): Promise<Log[]> {
    const offset = (page - 1) * PER_PAGE;

    const where: Prisma.LogWhereInput = {};

    if (query) {
      where.OR = [
        { target: { contains: query } },
        { Dispatcher: { name: { contains: query } } },
      ];
    }

    if (queryAction) where.action = { equals: queryAction };
    if (queryTargetType) where.targetType = { equals: queryTargetType };

    const logs = await this.prisma.log.findMany({
      take: PER_PAGE,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      where,
    });

    const mappedLogs: Log[] = [];

    for (const log of logs) {
      const mappedLog = PrismaLogMapper.toDomain(log);
      mappedLogs.push(mappedLog);
    }

    return mappedLogs;
  }

  async findManyWithAuthor({
    amount: PER_PAGE = QUANTITY_PER_PAGE,
    page = 1,
    query,
    action: queryAction,
    targetType: queryTargetType,
  }: LogsPaginationParams): Promise<PaginationResponse<LogWithAuthor>> {
    const offset = (page - 1) * PER_PAGE;

    const where: Prisma.LogWhereInput = {};

    if (query) {
      where.OR = [
        { target: { contains: query } },
        { Dispatcher: { name: { contains: query } } },
      ];
    }

    if (queryAction) where.action = { equals: queryAction };
    if (queryTargetType) where.targetType = { equals: queryTargetType };

    const [logs, logsTotalCount] = await Promise.all([
      this.prisma.log.findMany({
        take: PER_PAGE,
        skip: offset,
        orderBy: {
          createdAt: 'desc',
        },
        where,
        include: {
          Dispatcher: true,
        },
      }),

      this.prisma.log.count({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const mappedLogs = logs.map(PrismaLogMapper.toDomainWithAuthor);

    return { value: mappedLogs, totalCount: logsTotalCount };
  }
}
