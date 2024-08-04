import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { Post, PostProps } from '@/domain/posts/entities/post';
import { PostTagList } from '@/domain/posts/entities/post-tag-list';
import { PrismaPostMapper } from '@/infra/db/prisma/mappers/prisma-post-mapper';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostFactory {
  constructor(private prisma: PrismaService) {}

  static exec(
    override?: Optional<
      PostProps,
      | 'createdAt'
      | 'content'
      | 'slug'
      | 'tags'
      | 'title'
      | 'topstory'
      | 'updatedAt'
      | 'authorId'
    >,
    id?: EntityUniqueId,
  ) {
    const post = Post.create(
      {
        tags: new PostTagList([]),
        title: faker.lorem.lines(1),
        topstory: faker.image.url(),
        authorId: new EntityUniqueId(),
        content: faker.lorem.paragraphs(),
        createdAt: new Date(),
        ...override,
      },
      id,
    );

    if (!id) post.addCreatedEventToDispatch();

    return post;
  }

  async createAndPersist(
    override?: Optional<
      PostProps,
      | 'createdAt'
      | 'content'
      | 'slug'
      | 'tags'
      | 'title'
      | 'topstory'
      | 'updatedAt'
      | 'authorId'
    >,
    id?: EntityUniqueId,
  ) {
    const post = PostFactory.exec(override, id);
    const prismaPost = PrismaPostMapper.toPrisma(post);

    await this.prisma.post.create({ data: prismaPost });

    return post;
  }
}
