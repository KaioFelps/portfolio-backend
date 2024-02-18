import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../repositories/users-repository';
import { UserRole } from '../entities/user';
import { Either, fail, ok } from '@/core/types/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

interface DeleteUserServiceRequest {
  adminId: string;
  userId: string;
}

type DeleteUserServiceResponse = Either<UnauthorizedError, unknown>;

@Injectable()
export class DeleteUserService {
  constructor(private usersRepository: IUsersRepository) {}

  async exec({
    adminId,
    userId,
  }: DeleteUserServiceRequest): Promise<DeleteUserServiceResponse> {
    if (adminId === userId) {
      return fail(new UnauthorizedError());
    }

    const adminUser = await this.usersRepository.findById(adminId);

    if (adminUser.role !== UserRole.admin || !adminUser) {
      return fail(new UnauthorizedError());
    }

    const user = await this.usersRepository.findById(userId);

    if (user.role === UserRole.admin) {
      return fail(new UnauthorizedError());
    }

    await this.usersRepository.delete(user);

    return ok({});
  }
}