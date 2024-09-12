/* eslint-disable @typescript-eslint/no-namespace */
import { LogAction, LogTargetType } from '@/domain/logs/entities/log';
import {
  LogTargetType as prismaLogTargetType,
  LogAction as prismaLogAction,
} from '@prisma/client';

export namespace PrismaLogEnumsMappers {
  export class Action {
    public static toPrisma(action: LogAction): prismaLogAction {
      switch (action) {
        case LogAction.created:
          return 'CREATED';
        case LogAction.deleted:
          return 'DELETED';
        case LogAction.updated:
          return 'UPDATED';
      }
    }

    public static toDomain(action: prismaLogAction): LogAction {
      switch (action) {
        case 'CREATED':
          return LogAction.created;
        case 'DELETED':
          return LogAction.deleted;
        case 'UPDATED':
          return LogAction.updated;
      }
    }
  }

  export class TargetType {
    public static toPrisma(targetType: LogTargetType): prismaLogTargetType {
      switch (targetType) {
        case LogTargetType.post:
          return 'POST';
        case LogTargetType.project:
          return 'PROJECT';
        case LogTargetType.user:
          return 'USER';
        case LogTargetType.tag:
          return 'TAG';
      }
    }

    public static toDomain(targetType: prismaLogTargetType): LogTargetType {
      switch (targetType) {
        case 'POST':
          return LogTargetType.post;
        case 'PROJECT':
          return LogTargetType.project;
        case 'USER':
          return LogTargetType.user;
        case 'TAG':
          return LogTargetType.tag;
      }
    }
  }
}
