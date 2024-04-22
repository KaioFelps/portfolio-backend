import { Injectable } from '@nestjs/common';
import {
  IPostsRepository,
  PostListPaginationParams,
} from '../repositories/posts-repository';
import { Either, ok } from '@/core/types/either';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Post } from '../entities/post';

interface FetchManyPostsServiceRequest extends PostListPaginationParams {}

type FetchManyPostsServiceResponse = Either<
  null,
  { posts: Post[]; count: number }
>;

@Injectable()
export class FetchManyPostsService {
  constructor(private postsRepository: IPostsRepository) {}

  async exec({
    amount,
    page,
    query,
    tag,
  }: FetchManyPostsServiceRequest): Promise<FetchManyPostsServiceResponse> {
    const { value: posts, totalCount } = await this.postsRepository.findMany({
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
