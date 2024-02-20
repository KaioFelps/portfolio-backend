import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { PostTag } from '@/domain/posts/entities/post-tag';
import { IPostTagsRepository } from '@/domain/posts/repositories/post-tags-repository';

export class InMemoryPostTagsRepository implements IPostTagsRepository {
  public items: PostTag[] = [];

  async createMany(tags: PostTag[]): Promise<void> {
    this.items.push(...tags);
  }

  async deleteMany(tags: PostTag[]): Promise<void> {
    const newItems = this.items.filter((item) => {
      return !tags.some((tag) => tag.equals(item));
    });

    this.items = newItems;
  }

  async findManyByPostId(postId: EntityUniqueId): Promise<PostTag[]> {
    const foundItems = this.items.filter((item) => item.postId.equals(postId));

    return foundItems;
  }
}
