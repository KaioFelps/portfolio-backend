import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { PostTag } from '@/domain/posts/entities/post-tag';
import { IPostTagsRepository } from '@/domain/posts/repositories/post-tags-repository';
import { Injectable } from '@nestjs/common';
import { PrismaPostTagMapper } from '../mappers/prisma-post-tag-mapper';
import { PrismaService } from '../prisma-service';

@Injectable()
export class PrismaPostTagsRepository implements IPostTagsRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(tags: PostTag[]): Promise<void> {
    await this.prisma.tag.createMany(
      PrismaPostTagMapper.toPrismaCreateMany(tags),
    );
  }

  async deleteMany(tags: PostTag[]): Promise<void> {
    const tagsIds = tags.map((tag) => tag.id.toValue());

    await this.prisma.tag.deleteMany({
      where: {
        id: {
          in: tagsIds,
        },
      },
    });
  }

  async findManyByPostId(postId: EntityUniqueId): Promise<PostTag[]> {
    const prismaTags = await this.prisma.tag.findMany({
      where: {
        projectId: postId.toValue(),
      },
    });

    const tags = prismaTags.map(PrismaPostTagMapper.toDomain);

    return tags;
  }
}
