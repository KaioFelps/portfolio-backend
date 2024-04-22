import { Post } from '@/domain/posts/entities/post';

export class PostPresenter {
  static toHTTP(post: Post) {
    return {
      title: post.title,
      slug: post.slug,
      topstory: post.topstory,
      tags: post.tags,
      preview: post.content
        .substring(0, 100)
        .trimStart()
        .trimEnd()
        .concat('...'),
      createdAt: post.createdAt,
    };
  }
}
