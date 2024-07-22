import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { DomainEvents } from '@/core/events/domain-events';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { PaginationParams } from '@/core/types/pagination-params';
import { PaginationResponse } from '@/core/types/pagination-responses';
import { Tag } from '@/domain/tags/entities/tag';
import { ITagsRepository } from '@/domain/tags/repositories/tag-repository';

export class InMemoryTagsRepository implements ITagsRepository {
  public items: Tag[] = [];

  async create(tag: Tag): Promise<void> {
    this.items.push(tag);
    DomainEvents.dispatchEventsForAggregate(tag.id);
  }

  async delete(tagId: EntityUniqueId): Promise<void> {
    this.items = this.items.filter((item) => !item.id.equals(tagId));
    DomainEvents.dispatchEventsForAggregate(tagId);
  }

  async save(tag: Tag): Promise<void> {
    this.items = this.items.map((item) => {
      if (item.id.equals(tag.id)) {
        return tag;
      }

      return item;
    });

    DomainEvents.dispatchEventsForAggregate(tag.id);
  }

  async findById(id: string): Promise<Tag | null> {
    return this.items.find((tag) => tag.id.toValue() === id) ?? null;
  }

  async findByValue(value: string): Promise<Tag | null> {
    return (
      this.items.find(
        (tag) => tag.value.toLowerCase() === value.toLowerCase(),
      ) ?? null
    );
  }

  async findMany({
    amount: itemsPerPage = QUANTITY_PER_PAGE,
    page = 1,
    query,
  }: PaginationParams): Promise<PaginationResponse<Tag>> {
    let tags: Tag[] = [];

    if (query) {
      tags = this.items.filter((item) => {
        if (item.value.toLowerCase().includes(query.trim().toLowerCase()))
          return item;

        return null;
      });
    } else {
      tags = this.items;
    }

    const projectsTotalCount = tags.length;

    tags = tags.slice((page - 1) * itemsPerPage, itemsPerPage * page);

    return { value: tags, totalCount: projectsTotalCount };
  }

  async findManyByIds(ids: string[]): Promise<Tag[]> {
    const tags = this.items.filter((item) => ids.includes(item.id.toValue()));
    return tags;
  }
}
