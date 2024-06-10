import { PaginationParams } from '@/core/types/pagination-params';
import { Post } from '../entities/post';
import { PostWithAuthor } from '../entities/value-objects/post-with-author';
import { PaginationResponse } from '@/core/types/pagination-responses';

export interface PostListPaginationParams extends PaginationParams {
  tag?: string;
}

export abstract class IPostsRepository {
  abstract create(post: Post): Promise<void>;
  abstract findById(id: string): Promise<Post | null>;
  abstract findBySlug(slug: string): Promise<Post | null>;
  abstract findBySlugWithAuthor(slug: string): Promise<PostWithAuthor | null>;
  abstract findMany(
    params: PostListPaginationParams,
  ): Promise<PaginationResponse<Post>>;

  abstract findManyPublished(
    params: PostListPaginationParams,
  ): Promise<PaginationResponse<Post>>;

  abstract save(post: Post): Promise<void>;
  abstract delete(post: Post): Promise<void>;
}
