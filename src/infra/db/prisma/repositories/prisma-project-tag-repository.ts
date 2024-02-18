import { ProjectTag } from '@/domain/projects/entities/project-tag';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { PrismaProjectTagMapper } from '../mappers/prisma-project-tag-mapper';

@Injectable()
export class IProjectTagsRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(tags: ProjectTag[]): Promise<void> {
    await this.prisma.tag.createMany({
      data: tags.map(PrismaProjectTagMapper.toPrisma),
    });
  }

  async deleteMany(tags: ProjectTag[]): Promise<void> {
    const tagsIds = tags.map((tag) => tag.id.toValue());

    await this.prisma.tag.deleteMany({
      where: {
        id: {
          in: tagsIds,
        },
      },
    });
  }
}
