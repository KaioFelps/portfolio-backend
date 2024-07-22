import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { PostTag, PostTagProps } from '@/domain/posts/entities/post-tag';
import { PrismaPostTagMapper } from '@/infra/db/prisma/mappers/prisma-post-tag-mapper';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { Injectable } from '@nestjs/common';
import { TagFactory } from './tag-factory';

@Injectable()
export class PostTagFactory {
  constructor(private prisma: PrismaService) {}

  static exec(
    override?: Optional<PostTagProps, 'postId' | 'tag'>,
    id?: EntityUniqueId,
  ) {
    return PostTag.create(
      {
        postId: new EntityUniqueId(),
        tag: TagFactory.exec(),
        ...override,
      },
      id,
    );
  }

  async createAndPersist(
    override?: Optional<PostTagProps, 'postId' | 'tag'>,
    id?: EntityUniqueId,
  ) {
    const postTag = PostTagFactory.exec(override, id);
    const prismaPostTag = PrismaPostTagMapper.toPrisma(postTag);

    await this.prisma.tagsOnPostsOrProjects.create({ data: prismaPostTag });

    return postTag;
  }
}
