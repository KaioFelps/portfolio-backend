import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { PostTag } from '@/domain/posts/entities/post-tag';
import { Prisma, Tag as PrismaTag } from 'prisma/prisma-client';

export class PrismaPostTagMapper {
  static toDomain(tag: PrismaTag) {
    return PostTag.create(
      {
        postId: new EntityUniqueId(tag.postId!),
        value: tag.value,
      },
      new EntityUniqueId(tag.id),
    );
  }

  static toPrisma(tag: PostTag): PrismaTag {
    return {
      id: tag.id.toValue(),
      postId: tag.postId.toValue(),
      value: tag.value,
      projectId: null,
    };
  }

  static toPrismaCreateMany(tags: PostTag[]): Prisma.TagCreateManyArgs {
    const mappedTags: Prisma.TagCreateManyInput[] = tags.map((tag) => {
      return {
        id: tag.id.toValue(),
        postId: tag.postId.toValue(),
        value: tag.value,
      };
    });

    return {
      data: mappedTags,
    };
  }
}
