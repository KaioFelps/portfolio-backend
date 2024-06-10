import { Post } from '@/domain/posts/entities/post';
import { TagPresenter } from './tag-presenter';

export class PostPresenter {
  static toHTTP(post: Post) {
    return {
      id: post.id.toValue(),
      title: post.title,
      slug: post.slug,
      topstory: post.topstory,
      tags: post.tags.getItems().map(TagPresenter.toHTTP),
      preview: post.content
        .substring(0, 100)
        .trimStart()
        .trimEnd()
        .concat('...'),
      createdAt: post.createdAt,
      publishedAt: post.publishedAt,
    };
  }
}
