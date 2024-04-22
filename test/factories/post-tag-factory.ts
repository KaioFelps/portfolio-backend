import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { PostTag, PostTagProps } from '@/domain/posts/entities/post-tag';
import { PrismaPostTagMapper } from '@/infra/db/prisma/mappers/prisma-post-tag-mapper';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostTagFactory {
  constructor(private prisma: PrismaService) {}

  static exec(
    override?: Optional<PostTagProps, 'postId' | 'value'>,
    id?: EntityUniqueId,
  ) {
    return PostTag.create(
      {
        postId: new EntityUniqueId(),
        value: faker.lorem.sentence(),
        ...override,
      },
      id,
    );
  }

  async createAndPersist(
    override?: Optional<PostTagProps, 'postId' | 'value'>,
    id?: EntityUniqueId,
  ) {
    const postTag = PostTagFactory.exec(override, id);
    const prismaPostTag = PrismaPostTagMapper.toPrisma(postTag);

    await this.prisma.tag.create({ data: prismaPostTag });

    return postTag;
  }
}
