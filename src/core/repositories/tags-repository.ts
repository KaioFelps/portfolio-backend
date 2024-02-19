import { EntityUniqueId } from '../entities/entity-unique-id';
import { Tag } from '../entities/tag';

export abstract class ITagsRepository {
  abstract findManyByValue(value: string): Promise<Tag[]>;
  abstract findById(id: EntityUniqueId): Promise<Tag | null>;
}
