import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Tag } from '@/domain/tags/entities/tag';
import { Prisma, Tag as PrismaTag } from 'prisma/prisma-client';

export class PrismaTagMapper {
  static toDomain(tag: PrismaTag) {
    return Tag.create(
      {
        value: tag.value,
      },
      new EntityUniqueId(tag.id),
    );
  }

  static toPrisma(tag: Tag): PrismaTag {
    return {
      id: tag.id.toValue(),
      value: tag.value,
    };
  }

  static toPrismaCreateMany(tags: Tag[]): Prisma.TagCreateManyArgs {
    const mappedTags: Prisma.TagCreateManyInput[] = tags.map((tag) => {
      return {
        id: tag.id.toValue(),
        value: tag.value,
      };
    });

    return {
      data: mappedTags,
    };
  }
}
