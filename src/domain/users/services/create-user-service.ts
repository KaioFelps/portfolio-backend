import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../repositories/users-repository';
import { User, UserRole } from '../entities/user';
import { Either, fail, ok } from '@/core/types/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

interface CreateUserServiceRequest {
  adminId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

type CreateUserServiceResponse = Either<UnauthorizedError, User>;

@Injectable()
export class CreateUserService {
  constructor(private usersRepository: IUsersRepository) {}

  async exec({
    adminId,
    email,
    name,
    password,
    role,
  }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    const adminUser = await this.usersRepository.findById(adminId);

    if (adminUser.role !== UserRole.admin || !adminUser) {
      return fail(new UnauthorizedError());
    }

    const user = User.create({
      email,
      name,
      password,
      role,
    });

    await this.usersRepository.create(user);

    return ok(user);
  }
}
