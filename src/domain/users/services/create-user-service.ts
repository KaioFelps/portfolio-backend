import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../repositories/users-repository';
import { User, UserRole } from '../entities/user';
import { Either, fail, ok } from '@/core/types/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { IHashGenerator } from '@/core/crypt/hash-generator';

interface CreateUserServiceRequest {
  adminId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

type CreateUserServiceResponse = Either<UnauthorizedError, { user: User }>;

@Injectable()
export class CreateUserService {
  constructor(
    private usersRepository: IUsersRepository,
    private hashGenerator: IHashGenerator,
  ) {}

  async exec({
    adminId,
    email,
    name,
    password,
    role,
  }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    const adminUser = await this.usersRepository.findById(adminId);

    if (!adminUser || adminUser.role !== UserRole.admin) {
      return fail(new UnauthorizedError());
    }

    const hashedPassword = await this.hashGenerator.generate(password);

    const user = User.create({
      email,
      name,
      password: hashedPassword,
      role,
    });

    user.addCreatedEventToDispatch(adminUser.id);
    await this.usersRepository.create(user);

    return ok({ user });
  }
}
