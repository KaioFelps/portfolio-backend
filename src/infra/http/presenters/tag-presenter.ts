import { Tag } from '@/domain/tags/entities/tag';

export type TagPresented = {
  id: string;
  value: string;
};

export class TagPresenter {
  static toHTTP(tag: Tag) {
    return {
      id: tag.id.toValue(),
      value: tag.value,
    } satisfies TagPresented;
  }
}
