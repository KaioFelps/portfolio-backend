import { Optional } from '@/core/types/optional';
import { User, UserProps, UserRole } from '@/domain/users/entities/user';
import { PrismaUserMapper } from '@/infra/db/prisma/mappers/prisma-user-mapper';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  static exec(
    role: 'admin' | 'editor',
    override?: Optional<
      UserProps,
      'createdAt' | 'email' | 'name' | 'password' | 'role'
    >,
  ) {
    return User.create({
      email: faker.internet.email(),
      name: faker.person.fullName({ sex: 'male' }),
      password: faker.internet.password(),
      role: UserRole[role],
      createdAt: new Date(),
      ...override,
    });
  }

  async createAndPersist(
    role: 'admin' | 'editor',
    override?: Optional<
      UserProps,
      'createdAt' | 'email' | 'name' | 'password' | 'role'
    >,
  ) {
    const user = UserFactory.exec(role, override);
    const prismaUser = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({ data: prismaUser });

    return user;
  }
}
