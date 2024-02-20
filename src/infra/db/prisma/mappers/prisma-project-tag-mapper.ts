import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { ProjectTag } from '@/domain/projects/entities/project-tag';
import { Prisma, Tag as PrismaTag } from 'prisma/prisma-client';

export class PrismaProjectTagMapper {
  static toDomain(tag: PrismaTag) {
    return ProjectTag.create(
      {
        projectId: new EntityUniqueId(tag.projectId),
        value: tag.value,
      },
      new EntityUniqueId(tag.id),
    );
  }

  static toPrisma(tag: ProjectTag): PrismaTag {
    return {
      id: tag.id.toValue(),
      projectId: tag.projectId.toValue(),
      value: tag.value,
      postId: null,
    };
  }

  static toPrismaCreateMany(tags: ProjectTag[]): Prisma.TagCreateManyArgs {
    const mappedTags: Prisma.TagCreateManyInput[] = tags.map((tag) => {
      return {
        id: tag.id.toValue(),
        projectId: tag.projectId.toValue(),
        value: tag.value,
      };
    });

    return {
      data: mappedTags,
    };
  }
}
