import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { PostTag } from '@/domain/posts/entities/post-tag';

export abstract class IPostTagsRepository {
  abstract createMany(tags: PostTag[]): Promise<void>;
  abstract deleteMany(tags: PostTag[]): Promise<void>;
  abstract findManyByPostId(postId: EntityUniqueId): Promise<PostTag[]>;
}
