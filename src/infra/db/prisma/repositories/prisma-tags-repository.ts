import { PaginationParams } from '@/core/types/pagination-params';
import { PaginationResponse } from '@/core/types/pagination-responses';
import { Tag } from '@/domain/tags/entities/tag';
import { ITagsRepository } from '@/domain/tags/repositories/tag-repository';
import { Injectable } from '@nestjs/common';
import { PrismaTagMapper } from '../mappers/prisma-tag-mapper';
import { PrismaService } from '../prisma-service';
import { DomainEvents } from '@/core/events/domain-events';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Prisma } from '@prisma/client';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';

@Injectable()
export class PrismaTagsRepository implements ITagsRepository {
  constructor(private prisma: PrismaService) {}

  async create(tag: Tag): Promise<void> {
    const mappedTag = PrismaTagMapper.toPrisma(tag);

    await this.prisma.tag.create({
      data: mappedTag,
    });

    DomainEvents.dispatchEventsForAggregate(tag.id);
  }

  async delete(tagId: EntityUniqueId): Promise<void> {
    await this.prisma.tag.delete({
      where: {
        id: tagId.toValue(),
      },
    });

    DomainEvents.dispatchEventsForAggregate(tagId);
  }

  async save(tag: Tag): Promise<void> {
    const mappedTag = PrismaTagMapper.toPrisma(tag);

    await this.prisma.tag.update({
      data: mappedTag,
      where: {
        id: tag.id.toValue(),
      },
    });

    DomainEvents.dispatchEventsForAggregate(tag.id);
  }

  async findById(id: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    if (!tag) return null;

    const mappedTag = PrismaTagMapper.toDomain(tag);

    return mappedTag;
  }

  async findByValue(value: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findFirst({
      where: { value: { equals: value, mode: 'insensitive' } },
    });

    if (!tag) return null;

    const mappedTag = PrismaTagMapper.toDomain(tag);

    return mappedTag;
  }

  async findMany({
    amount = QUANTITY_PER_PAGE,
    page = 1,
    // id
    query,
  }: PaginationParams): Promise<PaginationResponse<Tag>> {
    const offset = (page - 1) * amount;

    const where: Prisma.TagWhereInput = { id: query };

    const [tags, tagsTotalCount] = await Promise.all([
      this.prisma.tag.findMany({
        take: amount,
        skip: offset,
        orderBy: {
          value: 'asc',
        },
        where,
      }),
      this.prisma.tag.count({
        where,
        orderBy: {
          value: 'asc',
        },
      }),
    ]);

    const mappedTags = tags.map(PrismaTagMapper.toDomain);

    return { value: mappedTags, totalCount: tagsTotalCount };
  }

  async findManyByIds(ids: string[]): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      where: {
        id: { in: ids },
      },
    });

    const mappedTags = tags.map(PrismaTagMapper.toDomain);

    return mappedTags;
  }
}
