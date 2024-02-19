import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Tag } from '@/core/entities/tag';
import { ITagsRepository } from '@/core/repositories/tags-repository';

export class InMemoryTagsRepository implements ITagsRepository {
  public items: Tag[] = [];

  async findManyByValue(value: string): Promise<Tag[]> {
    return this.items.filter((item) => item.value === value);
  }

  async findById(id: EntityUniqueId): Promise<Tag> {
    const tagIndex = this.items.findIndex((item) => item.id.equals(id));

    if (tagIndex < 0) {
      return null;
    }

    return this.items[tagIndex];
  }
}
