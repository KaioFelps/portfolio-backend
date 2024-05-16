import { Log } from '@/domain/logs/entities/log';
import { LogWithAuthor } from '@/domain/logs/entities/value-objects/log-with-author';
import { Prisma, Log as PrismaLog, User as PrismaUser } from '@prisma/client';
import { PrismaUserMapper } from './prisma-user-mapper';
import { PrismaLogEnumsMappers } from './enums/prisma-log-enums-mapper';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';

type PrismaLogWithAuthor = PrismaLog & { Dispatcher: PrismaUser | null };

export class PrismaLogMapper {
  static toPrisma(log: Log): Prisma.LogCreateArgs {
    return {
      data: {
        dispatcherId: log.dispatcherId?.toValue(),
        id: log.id.toValue(),
        action: log.action,
        target: log.target,
        targetType: log.targetType,
        createdAt: log.createdAt,
      },
    };
  }

  static toDomain(prismaLog: PrismaLog): Log {
    return Log.create({
      action: PrismaLogEnumsMappers.Action.toDomain(prismaLog.action),
      target: prismaLog.target,
      targetType: PrismaLogEnumsMappers.TargetType.toDomain(
        prismaLog.targetType,
      ),

      createdAt: prismaLog.createdAt,
      dispatcherId: prismaLog.dispatcherId
        ? new EntityUniqueId(prismaLog.dispatcherId)
        : null,
    });
  }

  static toDomainWithAuthor(prismaLog: PrismaLogWithAuthor): LogWithAuthor {
    return LogWithAuthor.create({
      action: prismaLog.action,
      createdAt: prismaLog.createdAt,
      target: prismaLog.target,
      targetType: prismaLog.targetType,
      dispatcher: prismaLog.Dispatcher
        ? PrismaUserMapper.toDomain(prismaLog.Dispatcher)
        : null,
    });
  }
}
