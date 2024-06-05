import { PaginationParams } from '@/core/types/pagination-params';
import { User } from '@/domain/users/entities/user';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { PrismaRoleMapper } from '../mappers/prisma-role-mapper';
import { PaginationResponse } from '@/core/types/pagination-responses';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { DomainEvents } from '@/core/events/domain-events';

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const mappedUser = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data: mappedUser,
    });

    DomainEvents.dispatchEventsForAggregate(user.id);
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
  }: PaginationParams): Promise<PaginationResponse<User>> {
    const PER_PAGE = amount ?? QUANTITY_PER_PAGE;

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

    const usersTotalCount = await this.prisma.user.count({
      where: {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
          {
            role: queryToRole ? { equals: queryToRole } : undefined,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const mappedUsers: User[] = [];

    for (const user of users) {
      mappedUsers.push(PrismaUserMapper.toDomain(user));
    }

    return {
      value: mappedUsers,
      totalCount: usersTotalCount,
    };
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.update({
      data: PrismaUserMapper.toPrisma(user),
      where: {
        id: user.id.toValue(),
      },
    });

    DomainEvents.dispatchEventsForAggregate(user.id);
  }

  async delete(user: User): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: user.id.toValue(),
      },
    });

    DomainEvents.dispatchEventsForAggregate(user.id);
  }
}
