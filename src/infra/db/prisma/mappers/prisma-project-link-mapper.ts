import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { ProjectLink } from '@/domain/projects/entities/project-link';
import { Link as PrismaLink, Prisma } from 'prisma/prisma-client';

export class PrismaProjectLinkMapper {
  static toDomain(link: PrismaLink) {
    return ProjectLink.create(
      {
        projectId: new EntityUniqueId(link.projectId!),
        value: link.value,
      },
      new EntityUniqueId(link.id),
    );
  }

  static toPrisma(link: ProjectLink): Prisma.LinkCreateManyInput {
    return {
      value: link.value,
      id: link.id.toValue(),
      projectId: link.projectId.toValue(),
    };
  }
}
