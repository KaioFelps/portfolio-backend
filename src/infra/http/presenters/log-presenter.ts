import { LogWithAuthor } from '@/domain/logs/entities/value-objects/log-with-author';

export class LogPresenter {
  static toHTTP(log: LogWithAuthor) {
    return {
      id: log.id,
      action: log.action,
      author: log.dispatcher,
      target: log.target,
      targetType: log.targetType,
      createdAt: log.createdAt,
    };
  }
}
