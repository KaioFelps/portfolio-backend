import { ProjectTag } from '@/domain/projects/entities/project-tag';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { PrismaProjectTagMapper } from '../mappers/prisma-project-tag-mapper';
import { IProjectTagsRepository } from '@/domain/projects/repositories/project-tags-repository';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';

@Injectable()
export class PrismaProjectTagsRepository implements IProjectTagsRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(tags: ProjectTag[]): Promise<void> {
    await this.prisma.tagsOnPostsOrProjects.createMany(
      PrismaProjectTagMapper.toPrismaCreateMany(tags),
    );
  }

  async deleteMany(tags: ProjectTag[]): Promise<void> {
    const tagsIds = tags.map((tag) => tag.id.toValue());

    await this.prisma.tagsOnPostsOrProjects.deleteMany({
      where: {
        id: {
          in: tagsIds,
        },
      },
    });
  }

  async findManyByProjectId(projectId: EntityUniqueId): Promise<ProjectTag[]> {
    const prismaTags = await this.prisma.tagsOnPostsOrProjects.findMany({
      where: {
        projectId: projectId.toValue(),
      },
      include: {
        Tag: true,
      },
    });

    const tags = prismaTags.map(PrismaProjectTagMapper.toDomain);

    return tags;
  }
}
