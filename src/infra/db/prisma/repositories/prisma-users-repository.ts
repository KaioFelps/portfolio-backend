import { PaginationParams } from '@/core/types/pagination-params';
import { User } from '@/domain/users/entities/user';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { PrismaRoleMapper } from '../mappers/prisma-role-mapper';

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const mappedUser = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data: mappedUser,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findMany({
    amount,
    page = 1,
    query = '',
  }: PaginationParams): Promise<User[]> {
    const PER_PAGE = amount ?? 10;

    const offset = (page - 1) * PER_PAGE;

    const queryToRole = PrismaRoleMapper.toPrisma(query);

    const users = await this.prisma.user.findMany({
      take: PER_PAGE,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
          {
            role: queryToRole ? { equals: queryToRole } : undefined,
          },
        ],
      },
    });

    const mappedUsers: User[] = [];

    for (const user of users) {
      mappedUsers.push(PrismaUserMapper.toDomain(user));
    }

    return mappedUsers;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.update({
      data: PrismaUserMapper.toPrisma(user),
      where: {
        id: user.id.toValue(),
      },
    });
  }

  async delete(user: User): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: user.id.toValue(),
      },
    });
  }
}
