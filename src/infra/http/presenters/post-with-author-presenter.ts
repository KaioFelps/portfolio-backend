import { PostWithAuthor } from '@/domain/posts/entities/value-objects/post-with-author';
import { ProjectAndPostTagPresenter } from './project-and-post-tag-presenter';

export type PostWithAuthorPresented = {
  id: string;
  author: string;
  title: string;
  slug: string;
  topstory: string;
  tags: Array<{ id: string; value: string }>;
  content: string;
  updatedAt: string | Date | null | undefined;
  publishedAt: string | Date | null | undefined;
  createdAt: string | Date;
  description: string;
};

export class PostWithAuthorPresenter {
  static toHTTP(post: PostWithAuthor) {
    return {
      id: post.id.toValue(),
      author: post.author,
      title: post.title,
      slug: post.slug.value,
      topstory: post.topstory,
      tags: post.tags.getItems().map(ProjectAndPostTagPresenter.toHTTP),
      content: post.content,
      updatedAt: post.updatedAt,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      description: post.description,
    } satisfies PostWithAuthorPresented;
  }
}
