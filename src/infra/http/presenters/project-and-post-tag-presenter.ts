import { PostTag } from '@/domain/posts/entities/post-tag';
import { ProjectTag } from '@/domain/projects/entities/project-tag';

export class ProjectAndPostTagPresenter {
  static toHTTP(tag: PostTag | ProjectTag) {
    return {
      id: tag.tag.id.toValue(),
      value: tag.tag.value,
    };
  }
}
