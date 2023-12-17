import { Post } from '@/domain/posts/entities/post';
import { IPostsRepository } from '@/domain/posts/repositories/posts-repository';

export class InMemoryPostsRepository implements IPostsRepository {
  public items: Post[] = [];

  async create(post: Post): Promise<void> {
    this.items.push(post);
  }

  async findById(id: string): Promise<Post> {
    return this.items.find((item) => item.id.toValue() === id);
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
