import { Optional } from '@/core/types/optional';
import {
  Log,
  LogAction,
  LogProps,
  LogTargetType,
} from '@/domain/logs/entities/log';
import { PrismaLogMapper } from '@/infra/db/prisma/mappers/prisma-log-mapper';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogFactory {
  constructor(private prisma: PrismaService) {}

  static exec(
    override?: Optional<
      LogProps,
      'action' | 'createdAt' | 'dispatcherId' | 'target' | 'targetType'
    >,
  ) {
    return Log.create({
      action: LogAction.created,
      target: faker.lorem.sentence(),
      dispatcherId: null,
      createdAt: new Date(),
      targetType: LogTargetType.post,
      ...override,
    });
  }

  public async createAndPersist(
    override?: Optional<
      LogProps,
      'action' | 'createdAt' | 'dispatcherId' | 'target'
    >,
  ) {
    const log = LogFactory.exec(override);

    await this.prisma.log.create(PrismaLogMapper.toPrisma(log));

    return log;
  }
}
