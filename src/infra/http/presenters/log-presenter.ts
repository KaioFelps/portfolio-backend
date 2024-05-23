import { LogWithAuthor } from '@/domain/logs/entities/value-objects/log-with-author';
import { UserPresenter } from './user-presenter';

export class LogPresenter {
  static toHTTP(log: LogWithAuthor) {
    return {
      id: log.id.toValue(),
      action: log.action,
      author: log.dispatcher ? UserPresenter.toHTTP(log.dispatcher) : null,
      target: log.target,
      targetType: log.targetType,
      createdAt: log.createdAt,
    };
  }
}
