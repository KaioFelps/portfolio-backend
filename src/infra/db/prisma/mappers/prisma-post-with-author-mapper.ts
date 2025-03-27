import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import {
  Post as PrismaPost,
  Tag as PrismaTag,
  TagsOnPostsOrProjects as PrismaTagsOnPostsOrProjects,
  User as PrismaUser,
} from '@prisma/client';
import { Slug } from '@/domain/posts/entities/value-objects/slug';
import { PostWithAuthor } from '@/domain/posts/entities/value-objects/post-with-author';
import { PostTagList } from '@/domain/posts/entities/post-tag-list';
import { PrismaPostTagMapper } from './prisma-post-tag-mapper';

type toDomainParams = PrismaPost & {
  tags: Array<{ Tag: PrismaTag } & PrismaTagsOnPostsOrProjects>;
  author: PrismaUser;
};

export class PrismaPostWithAuthorMapper {
  static toDomain({
    createdAt,
    id,
    author,
    tags,
    title,
    topstory,
    content,
    slug,
    updatedAt,
    publishedAt,
    description,
  }: toDomainParams): PostWithAuthor {
    return PostWithAuthor.create({
      title,
      topstory,
      createdAt,
      tags: new PostTagList(tags.map(PrismaPostTagMapper.toDomain)),
      content,
      slug: Slug.create(slug),
      updatedAt,
      author: author.name,
      id: new EntityUniqueId(id),
      publishedAt,
      description,
    });
  }
}
