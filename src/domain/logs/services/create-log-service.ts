import { Injectable } from '@nestjs/common';
import { ILogsRepository } from '../repositories/logs-repository';
import { Log, LogAction } from '../entities/log';
import { Either, fail, ok } from '@/core/types/either';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { User } from '@/domain/users/entities/user';

export interface CreateLogServiceRequest {
  dispatcherId?: EntityUniqueId;
  target: string;
  action: LogAction;
  occurredAt?: Date;
}

export type CreateLogServiceResponse = Either<BadRequestError, { log: Log }>;

@Injectable()
export class CreateLogService {
  constructor(
    private logsRepository: ILogsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async exec({
    action,
    dispatcherId,
    target,
    occurredAt,
  }: CreateLogServiceRequest): Promise<CreateLogServiceResponse> {
    let dispatcher: User | null;

    if (dispatcherId) {
      dispatcher = await this.usersRepository.findById(dispatcherId.toValue());

      if (!dispatcher) {
        return fail(new BadRequestError());
      }
    } else {
      dispatcher = null;
    }

    const log = Log.create({
      action,
      dispatcherId,
      target,
      createdAt: occurredAt,
    });

    await this.logsRepository.create(log);

    return ok({ log });
  }
}
