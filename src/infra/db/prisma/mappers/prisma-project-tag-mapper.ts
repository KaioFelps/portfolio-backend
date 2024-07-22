import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { ProjectTag } from '@/domain/projects/entities/project-tag';
import {
  Prisma,
  TagsOnPostsOrProjects as PrismaTag,
} from 'prisma/prisma-client';
import { PrismaTagMapper } from './prisma-tag-mapper';
import type { PrismaComposedTag } from '../types/composed-tag';

export class PrismaProjectTagMapper {
  static toDomain(tag: PrismaComposedTag) {
    return ProjectTag.create(
      {
        projectId: new EntityUniqueId(tag.projectId!),
        tag: PrismaTagMapper.toDomain(tag.Tag),
      },
      new EntityUniqueId(tag.id),
    );
  }

  static toPrisma(tag: ProjectTag): PrismaTag {
    return {
      id: tag.id.toValue(),
      projectId: tag.projectId.toValue(),
      tagId: tag.tag.id.toValue(),
      postId: null,
    };
  }

  static toPrismaCreateMany(
    tags: ProjectTag[],
  ): Prisma.TagsOnPostsOrProjectsCreateManyArgs {
    const mappedTags: Prisma.TagsOnPostsOrProjectsCreateManyInput[] = tags.map(
      (tag) => {
        return {
          id: tag.id.toValue(),
          projectId: tag.projectId.toValue(),
          tagId: tag.tag.id.toValue(),
        };
      },
    );

    return {
      data: mappedTags,
    };
  }
}
