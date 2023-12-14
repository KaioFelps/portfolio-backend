import { Injectable } from '@nestjs/common';
import { ILogsRepository } from '../repositories/logs-repository';
import { Log, LogAction, LogTarget } from '../entities/log';
import { Either, fail, ok } from '@/core/types/either';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';

interface CreateLogServiceRequest {
  dispatcherId: EntityUniqueId;
  target: LogTarget;
  action: LogAction;
}

type CreateLogServiceResponse = Either<BadRequestError, Log>;

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
  }: CreateLogServiceRequest): Promise<CreateLogServiceResponse> {
    const dispatcher = await this.usersRepository.findById(
      dispatcherId.toValue(),
    );

    if (!dispatcher) {
      return fail(new BadRequestError());
    }

    const log = Log.create({
      action,
      dispatcherId,
      target,
    });

    await this.logsRepository.create(log);

    return ok(log);
  }
}
