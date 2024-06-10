import { Injectable } from '@nestjs/common';
import {
  IPostsRepository,
  PostListPaginationParams,
} from '../repositories/posts-repository';
import { Either, ok } from '@/core/types/either';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Post } from '../entities/post';

interface FetchManyPublishedPostsServiceRequest
  extends PostListPaginationParams {}

type FetchManyPublishedPostsServiceResponse = Either<
  null,
  { posts: Post[]; count: number }
>;

@Injectable()
export class FetchManyPublishedPostsService {
  constructor(private postsRepository: IPostsRepository) {}

  async exec({
    amount,
    page,
    query,
    tag,
  }: FetchManyPublishedPostsServiceRequest): Promise<FetchManyPublishedPostsServiceResponse> {
    const { value: posts, totalCount } =
      await this.postsRepository.findManyPublished({
        amount: amount ?? QUANTITY_PER_PAGE,
        page: page ?? 1,
        query,
        tag,
      });

    return ok({
      posts,
      count: totalCount,
    });
  }
}
