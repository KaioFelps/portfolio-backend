import { PostWithAuthor } from '@/domain/posts/entities/value-objects/post-with-author';

export class PostPresenter {
  static toHTTP(post: PostWithAuthor) {
    return {
      id: post.id,
      author: post.author,
      title: post.title,
      slug: post.slug,
      topstory: post.topstory,
      tags: post.tags,
      content: post.content,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
    };
  }
}
