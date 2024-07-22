import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { PostTag } from '@/domain/posts/entities/post-tag';
import {
  Prisma,
  TagsOnPostsOrProjects as PrismaTagsOnPostsOrProjects,
} from 'prisma/prisma-client';
import { PrismaTagMapper } from './prisma-tag-mapper';
import type { PrismaComposedTag } from '../types/composed-tag';

export class PrismaPostTagMapper {
  static toDomain(tag: PrismaComposedTag) {
    return PostTag.create(
      {
        postId: new EntityUniqueId(tag.postId!),
        tag: PrismaTagMapper.toDomain(tag.Tag),
      },
      new EntityUniqueId(tag.id),
    );
  }

  static toPrisma(tag: PostTag): PrismaTagsOnPostsOrProjects {
    return {
      id: tag.id.toValue(),
      postId: tag.postId.toValue(),
      tagId: tag.tag.id.toValue(),
      projectId: null,
    };
  }

  static toPrismaCreateMany(
    tags: PostTag[],
  ): Prisma.TagsOnPostsOrProjectsCreateManyArgs {
    const mappedTags: Prisma.TagsOnPostsOrProjectsCreateManyInput[] = tags.map(
      (tag) => {
        return {
          id: tag.id.toValue(),
          postId: tag.postId.toValue(),
          tagId: tag.tag.id.toValue(),
        };
      },
    );

    return {
      data: mappedTags,
    };
  }
}
