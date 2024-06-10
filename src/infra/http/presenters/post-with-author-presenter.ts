import { PostWithAuthor } from '@/domain/posts/entities/value-objects/post-with-author';
import { TagPresenter } from './tag-presenter';

export class PostWithAuthorPresenter {
  static toHTTP(post: PostWithAuthor) {
    return {
      id: post.id.toValue(),
      author: post.author,
      title: post.title,
      slug: post.slug.value,
      topstory: post.topstory,
      tags: post.tags.getItems().map(TagPresenter.toHTTP),
      content: post.content,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
    };
  }
}
