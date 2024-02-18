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

  static toPrisma(tag: ProjectTag): Prisma.TagCreateManyInput {
    return {
      value: tag.value,
      id: tag.id.toValue(),
      projectId: tag.projectId,
    };
  }
}
