import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import {
  Post as PrismaPost,
  Tag as PrismaTag,
  User as PrismaUser,
} from '@prisma/client';
import { PrismaPostTagMapper } from './prisma-post-tag-mapper';
import { Slug } from '@/domain/posts/entities/value-objects/slug';
import { PostTagList } from '@/domain/posts/entities/post-tag-list';
import { PostWithAuthor } from '@/domain/posts/entities/value-objects/post-with-author';

type toDomainParams = PrismaPost & {
  tags: PrismaTag[];
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
    });
  }
}
