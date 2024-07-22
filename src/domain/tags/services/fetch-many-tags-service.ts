import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Either, ok } from '@/core/types/either';
import { PaginationParams } from '@/core/types/pagination-params';
import { ITagsRepository } from '../repositories/tag-repository';
import { Tag } from '../entities/tag';

interface FetchManyTagsServiceRequest extends PaginationParams {}

type FetchManyTagsServiceResponse = Either<
  null,
  { tags: Tag[]; count: number }
>;

export class FetchManyTagsService {
  constructor(private tagsRepository: ITagsRepository) {}

  async exec({
    amount = QUANTITY_PER_PAGE,
    page = 1,
    query,
  }: FetchManyTagsServiceRequest): Promise<FetchManyTagsServiceResponse> {
    const { totalCount, value } = await this.tagsRepository.findMany({
      amount,
      page,
      query,
    });

    return ok({
      tags: value,
      count: totalCount,
    });
  }
}
