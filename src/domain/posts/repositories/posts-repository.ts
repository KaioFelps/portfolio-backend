import { Post } from '../entities/post';

export abstract class IPostsRepository {
  abstract create(post: Post): Promise<void>;
}
