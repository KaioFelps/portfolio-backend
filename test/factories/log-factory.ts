import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { Log, LogAction, LogProps } from '@/domain/logs/entities/log';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

export class LogFactory {
  static exec(
    override?: Optional<
      LogProps,
      'action' | 'createdAt' | 'dispatcherId' | 'target'
    >,
  ) {
    return Log.create({
      action: LogAction.created,
      target: faker.lorem.sentence(),
      dispatcherId: new EntityUniqueId(randomUUID()),
      createdAt: new Date(),
      ...override,
    });
  }
}
