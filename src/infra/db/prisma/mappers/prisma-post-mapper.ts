import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Post } from '@/domain/posts/entities/post';
import { Prisma, Post as PrismaPost, Tag as PrismaTag } from '@prisma/client';
import { PrismaPostTagMapper } from './prisma-post-tag-mapper';
import { Slug } from '@/domain/posts/entities/value-objects/slug';
import { PostTagList } from '@/domain/posts/entities/post-tag-list';

type toDomainParams = PrismaPost & {
  tags: PrismaTag[];
};

export class PrismaPostMapper {
  static toPrisma(post: Post): Prisma.PostUncheckedCreateInput {
    return {
      authorId: post.authorId.toValue(),
      content: post.content,
      slug: post.slug,
      title: post.title,
      topstory: post.topstory,
      createdAt: post.createdAt,
      id: post.id.toValue(),
      updatedAt: post.updatedAt,
    };
  }

  static toDomain({
    createdAt,
    id,
    tags,
    title,
    topstory,
    authorId,
    content,
    slug,
    updatedAt,
  }: toDomainParams) {
    return Post.create(
      {
        title,
        topstory,
        createdAt,
        tags: new PostTagList(tags.map(PrismaPostTagMapper.toDomain)),
        authorId: new EntityUniqueId(authorId),
        content,
        slug: Slug.create(slug),
        updatedAt,
      },
      new EntityUniqueId(id),
    );
  }
}
