import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { User } from '@/domain/users/entities/user';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaRoleMapper } from './prisma-role-mapper';

type toDomainParams = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: $Enums.UserRole;
  createdAt: Date;
};

export class PrismaUserMapper {
  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      id: user.id.toValue(),
      name: user.name,
      password: user.password,
    };
  }

  static toDomain({
    createdAt,
    email,
    id,
    name,
    password,
    role,
  }: toDomainParams) {
    const mappedRole = PrismaRoleMapper.prismaToDomain(role);
    return User.create(
      {
        email,
        name,
        password,
        role: mappedRole,
        createdAt,
      },
      new EntityUniqueId(id),
    );
  }
}
