import { PaginationParams } from '@/core/types/pagination-params';
import { Post } from '../entities/post';

export abstract class IPostsRepository {
  abstract create(post: Post): Promise<void>;
  abstract findById(id: string): Promise<Post>;
  abstract findMany(params: PaginationParams): Promise<Post[]>;
  abstract save(post: Post): Promise<void>;
  abstract delete(post: Post): Promise<void>;
}
