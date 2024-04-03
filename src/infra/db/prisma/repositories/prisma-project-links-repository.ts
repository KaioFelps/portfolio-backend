import { ProjectLink } from '@/domain/projects/entities/project-link';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { PrismaProjectLinkMapper } from '../mappers/prisma-project-link-mapper';
import { IProjectLinksRepository } from '@/domain/projects/repositories/project-links-repository';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';

@Injectable()
export class PrismaProjectLinksRepository implements IProjectLinksRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(links: ProjectLink[]): Promise<void> {
    await this.prisma.link.createMany({
      data: links.map(PrismaProjectLinkMapper.toPrisma),
    });
  }

  async deleteMany(links: ProjectLink[]): Promise<void> {
    const linksIds = links.map((link) => link.id.toValue());

    await this.prisma.link.deleteMany({
      where: {
        id: {
          in: linksIds,
        },
      },
    });
  }

  async findManyByProjectId(projectId: EntityUniqueId): Promise<ProjectLink[]> {
    const prismaLinks = await this.prisma.link.findMany({
      where: {
        projectId: projectId.toValue(),
      },
    });

    const links = prismaLinks.map(PrismaProjectLinkMapper.toDomain);

    return links;
  }
}
