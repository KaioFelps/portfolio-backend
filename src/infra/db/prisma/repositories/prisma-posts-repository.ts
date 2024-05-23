import { Post } from '@/domain/posts/entities/post';
import { PostWithAuthor } from '@/domain/posts/entities/value-objects/post-with-author';
import {
  IPostsRepository,
  PostListPaginationParams,
} from '@/domain/posts/repositories/posts-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { PrismaPostMapper } from '../mappers/prisma-post-mapper';
import { DomainEvents } from '@/core/events/domain-events';
import { PrismaPostWithAuthorMapper } from '../mappers/prisma-post-with-author-mapper';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Prisma } from '@prisma/client';
import { PaginationResponse } from '@/core/types/pagination-responses';
import { IPostTagsRepository } from '@/domain/posts/repositories/post-tags-repository';

@Injectable()
export class PrismaPostsRepository implements IPostsRepository {
  constructor(
    private prisma: PrismaService,
    private postTagsRepository: IPostTagsRepository,
  ) {}

  async create(post: Post): Promise<void> {
    await this.prisma.post.create({
      data: PrismaPostMapper.toPrisma(post),
    });

    DomainEvents.dispatchEventsForAggregate(post.id);

    await Promise.all([
      this.postTagsRepository.createMany(post.tags.getItems()),
    ]);
  }

  async findById(id: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        tags: true,
      },
    });

    if (!post) {
      return null;
    }

    const mappedPost = PrismaPostMapper.toDomain(post);

    return mappedPost;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        tags: true,
      },
    });

    if (!post) {
      return null;
    }

    const mappedPost = PrismaPostMapper.toDomain(post);

    return mappedPost;
  }

  async findBySlugWithAuthor(slug: string): Promise<PostWithAuthor | null> {
    const post = await this.prisma.post.findUnique({
      where: {
        slug,
      },
      include: {
        tags: true,
        author: true,
      },
    });

    if (!post) {
      return null;
    }

    const mappedPost = PrismaPostWithAuthorMapper.toDomain(post);

    return mappedPost;
  }

  async findMany({
    amount,
    page = 1,
    query,
    tag,
  }: PostListPaginationParams): Promise<PaginationResponse<Post>> {
    const PER_PAGE = amount ?? QUANTITY_PER_PAGE;

    const offset = (page - 1) * PER_PAGE;

    const where: Prisma.PostWhereInput = {
      title: { contains: query },
      tags: tag
        ? {
            some: { value: tag },
          }
        : undefined,
    };

    const posts = await this.prisma.post.findMany({
      take: PER_PAGE,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      where,
      include: {
        tags: true,
      },
    });

    const postsTotalCount = await this.prisma.post.count({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const mappedPosts: Post[] = [];

    for (const post of posts) {
      const mappedPost = PrismaPostMapper.toDomain(post);
      mappedPosts.push(mappedPost);
    }

    return { value: mappedPosts, totalCount: postsTotalCount };
  }

  async save(post: Post): Promise<void> {
    await Promise.all([
      this.prisma.post.update({
        data: PrismaPostMapper.toPrisma(post),
        where: {
          id: post.id.toValue(),
        },
      }),

      this.postTagsRepository.createMany(post.tags.getNewItems()),
      this.postTagsRepository.deleteMany(post.tags.getRemovedItems()),
    ]);

    DomainEvents.dispatchEventsForAggregate(post.id);
  }

  async delete(post: Post): Promise<void> {
    DomainEvents.dispatchEventsForAggregate(post.id);

    await Promise.all([
      this.prisma.post.delete({
        where: {
          id: post.id.toValue(),
        },
      }),

      this.postTagsRepository.deleteMany(post.tags.getItems()),
    ]);
  }
}
