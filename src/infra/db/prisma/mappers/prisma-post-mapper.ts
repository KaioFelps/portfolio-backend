import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Post } from '@/domain/posts/entities/post';
import { Prisma, Post as PrismaPost } from '@prisma/client';
import { Slug } from '@/domain/posts/entities/value-objects/slug';
import { PostTagList } from '@/domain/posts/entities/post-tag-list';
import { PrismaPostTagMapper } from './prisma-post-tag-mapper';
import { PrismaComposedTag } from '../types/composed-tag';

type ToDomainParams = PrismaPost & {
  tags: Array<PrismaComposedTag>;
};

export class PrismaPostMapper {
  static toPrisma(post: Post): Prisma.PostUncheckedCreateInput {
    return {
      authorId: post.authorId.toValue(),
      description: post.description,
      content: post.content,
      slug: post.slug,
      title: post.title,
      topstory: post.topstory,
      createdAt: post.createdAt,
      publishedAt: post.publishedAt,
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
    description,
    slug,
    updatedAt,
    publishedAt,
  }: ToDomainParams) {
    return Post.create(
      {
        title,
        topstory,
        createdAt,
        tags: new PostTagList(tags.map(PrismaPostTagMapper.toDomain)),
        authorId: new EntityUniqueId(authorId),
        description,
        content,
        slug: Slug.create(slug),
        updatedAt,
        publishedAt: publishedAt ?? null,
      },
      new EntityUniqueId(id),
    );
  }
}
