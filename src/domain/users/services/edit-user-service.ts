import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '../repositories/users-repository';
import { User, UserRole } from '../entities/user';
import { Either, fail, ok } from '@/core/types/either';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { IHashGenerator } from '@/core/crypt/hash-generator';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

interface EditUserServiceRequest {
  adminId: string;
  userId: string;
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

type EditUserServiceResponse = Either<
  BadRequestError | UnauthorizedError,
  { user: User }
>;

@Injectable()
export class EditUserService {
  constructor(
    private usersRepository: IUsersRepository,
    private hasher: IHashGenerator,
  ) {}

  async exec({
    adminId,
    userId,
    email,
    name,
    password,
    role,
  }: EditUserServiceRequest): Promise<EditUserServiceResponse> {
    const admin = await this.usersRepository.findById(adminId);

    if (!admin || admin.role !== UserRole.admin) {
      return fail(new UnauthorizedError());
    }

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return fail(new BadRequestError());
    }

    user.email = email ?? user.email;
    user.name = name ?? user.name;
    user.role = role ?? user.role;

    if (password) {
      const hashedPassword = await this.hasher.generate(password);

      user.password = hashedPassword;
    }

    user.addEditedEventToDispatch(admin.id);

    try {
      await this.usersRepository.save(user);
    } finally {
      user.dispose();
    }

    return ok({ user });
  }
}
