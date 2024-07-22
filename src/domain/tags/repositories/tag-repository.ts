import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Tag } from '../entities/tag';
import { PaginationParams } from '@/core/types/pagination-params';
import { PaginationResponse } from '@/core/types/pagination-responses';

export abstract class ITagsRepository {
  abstract create(tag: Tag): Promise<void>;
  abstract delete(tagId: EntityUniqueId): Promise<void>;
  abstract findById(id: string): Promise<Tag | null>;
  abstract findByValue(value: string): Promise<Tag | null>;
  abstract findMany(params: PaginationParams): Promise<PaginationResponse<Tag>>;
  abstract findManyByIds(ids: string[]): Promise<Tag[]>;
  abstract save(tag: Tag): Promise<void>;
}
