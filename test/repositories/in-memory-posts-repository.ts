import { DomainEvents } from '@/core/events/domain-events';
import { Post } from '@/domain/posts/entities/post';
import { PostWithAuthor } from '@/domain/posts/entities/value-objects/post-with-author';
import {
  IPostsRepository,
  PostListPaginationParams,
} from '@/domain/posts/repositories/posts-repository';
import { InMemoryUsersRepository } from './in-memory-users-repository';
import { Slug } from '@/domain/posts/entities/value-objects/slug';
import { PaginationResponse } from '@/core/types/pagination-responses';

export class InMemoryPostsRepository implements IPostsRepository {
  public items: Post[] = [];

  constructor(private usersRepository: InMemoryUsersRepository) {}

  async create(post: Post): Promise<void> {
    this.items.push(post);

    DomainEvents.dispatchEventsForAggregate(post.id);
  }

  async findById(id: string): Promise<Post | null> {
    return this.items.find((item) => item.id.toValue() === id) || null;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return this.items.find((item) => item.slug === slug) || null;
  }

  async findMany({
    amount: itemsPerPage = 9,
    page = 1,
    query,
  }: PostListPaginationParams): Promise<PaginationResponse<Post>> {
    let posts: Post[] = [];

    if (query) {
      posts = this.items.filter((item) => {
        switch (query.type) {
          case 'tag':
            return item.tags.getItems().find((item) => {
              return item.tag.id.toValue() === query.value;
            });
          case 'title':
            return item.title
              .toLowerCase()
              .includes(query.value.trim().toLowerCase());
          default:
            return null;
        }
      });
    } else {
      posts = this.items;
    }

    const postsTotalCount = posts.length;

    posts = posts.slice((page - 1) * itemsPerPage, itemsPerPage * page);

    return { value: posts, totalCount: postsTotalCount };
  }

  async findManyPublished({
    amount: itemsPerPage = 9,
    page = 1,
    query,
  }: PostListPaginationParams): Promise<PaginationResponse<Post>> {
    let posts: Post[] = [];

    if (query) {
      posts = this.items.filter((item) => {
        switch (query.type) {
          case 'tag':
            return (
              item.publishedAt &&
              item.tags
                .getItems()
                .find((item) => item.tag.id.toValue() === query.value)
            );
          case 'title':
            return (
              item.publishedAt &&
              item.title
                .toLowerCase()
                .includes(query.value.trim().toLowerCase())
            );
          default:
            return Boolean(item.publishedAt);
        }
      });
    } else {
      posts = this.items.filter((item) => !!item.publishedAt);
    }

    const postsTotalCount = posts.length;

    posts = posts.slice((page - 1) * itemsPerPage, itemsPerPage * page);

    return { value: posts, totalCount: postsTotalCount };
  }

  async save(post: Post): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(post.id));

    this.items[itemIndex] = post;

    DomainEvents.dispatchEventsForAggregate(post.id);
  }

  async delete(post: Post): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(post.id));

    this.items.splice(itemIndex, 1);

    DomainEvents.dispatchEventsForAggregate(post.id);
  }

  async findBySlugWithAuthor(slug: string): Promise<PostWithAuthor | null> {
    const post = this.items.find((item) => item.slug === slug);

    if (!post) {
      return null;
    }

    const author = await this.usersRepository.findById(post.authorId.toValue());

    if (!author) {
      throw new Error(
        `Author with ID "${post.authorId.toString()} doesn't existe."`,
      );
    }

    return PostWithAuthor.create({
      author: author.name,
      content: post.content,
      createdAt: post.createdAt,
      slug: Slug.create(post.slug),
      tags: post.tags,
      title: post.title,
      topstory: post.topstory,
      updatedAt: post.updatedAt,
      id: post.id,
      publishedAt: post.publishedAt,
    });
  }
}
