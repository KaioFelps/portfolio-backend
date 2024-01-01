import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/types/pagination-params';
import { Post } from '@/domain/posts/entities/post';
import { IPostsRepository } from '@/domain/posts/repositories/posts-repository';

export class InMemoryPostsRepository implements IPostsRepository {
  public items: Post[] = [];

  async create(post: Post): Promise<void> {
    this.items.push(post);

    DomainEvents.dispatchEventsForAggregate(post.id);
  }

  async findById(id: string): Promise<Post> {
    return this.items.find((item) => item.id.toValue() === id);
  }

  async findBySlug(slug: string): Promise<Post> {
    return this.items.find((item) => item.slug === slug);
  }

  async findMany({
    amount: itemsPerPage,
    page,
    query,
  }: PaginationParams): Promise<Post[]> {
    let posts: Post[] = [];

    if (query) {
      posts = this.items.filter((item) => {
        if (item.title.includes(query.trim())) {
          return item;
        }

        if (item.tags.includes(query)) {
          return item;
        }

        return null;
      });
    } else {
      posts = this.items;
    }

    posts = posts.slice((page - 1) * itemsPerPage, itemsPerPage * page);

    return posts;
  }

  async save(post: Post): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(post.id));

    this.items[itemIndex] = post;
  }

  async delete(post: Post): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(post.id));

    this.items.splice(itemIndex, 1);
  }
}
