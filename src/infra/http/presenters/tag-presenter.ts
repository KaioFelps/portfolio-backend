import { Tag } from '@/domain/tags/entities/tag';

export class TagPresenter {
  static toHTTP(tag: Tag) {
    return {
      id: tag.id.toValue(),
      value: tag.value,
    };
  }
}
