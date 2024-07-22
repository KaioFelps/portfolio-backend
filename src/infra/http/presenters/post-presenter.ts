import { Post } from '@/domain/posts/entities/post';
import { ProjectAndPostTagPresenter } from './project-and-post-tag-presenter';

export type PostPresented = {
  id: string;
  title: string;
  slug: string;
  topstory: string;
  tags: { id: string; value: string }[];
  preview: string;
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
      preview: post.content
        .substring(0, 100)
        .trimStart()
        .trimEnd()
        .concat('...'),
      createdAt: post.createdAt,
      publishedAt: post.publishedAt,
    } satisfies PostPresented;
  }
}
