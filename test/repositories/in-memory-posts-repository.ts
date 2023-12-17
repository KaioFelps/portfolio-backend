import { Post } from '@/domain/posts/entities/post';
import { IPostsRepository } from '@/domain/posts/repositories/posts-repository';

export class InMemoryPostsRepository implements IPostsRepository {
  public items: Post[] = [];

  async create(post: Post): Promise<void> {
    this.items.push(post);
  }
}
