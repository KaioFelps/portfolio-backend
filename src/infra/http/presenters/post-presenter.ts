import { Post } from '@/domain/posts/entities/post';
import { ProjectAndPostTagPresenter } from './project-and-post-tag-presenter';

export type PostPresented = {
  id: string;
  title: string;
  slug: string;
  topstory: string;
  tags: { id: string; value: string }[];
  description: string;
  createdAt: string | Date;
  publishedAt: string | Date | null | undefined;
};

export class PostPresenter {
  static toHTTP(post: Post) {
    return {
      id: post.id.toValue(),
      title: post.title,
      slug: post.slug,
      topstory: post.topstory,
      tags: post.tags.getItems().map(ProjectAndPostTagPresenter.toHTTP),
      description: post.description,
      createdAt: post.createdAt,
      publishedAt: post.publishedAt,
    } satisfies PostPresented;
  }
}
