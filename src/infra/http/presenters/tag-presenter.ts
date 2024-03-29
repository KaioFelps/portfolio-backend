import { PostTag } from '@/domain/posts/entities/post-tag';
import { ProjectTag } from '@/domain/projects/entities/project-tag';

export class TagPresenter {
  static toHTTP(tag: ProjectTag | PostTag) {
    return {
      id: tag.id.toValue(),
      value: tag.value,
    };
  }
}
