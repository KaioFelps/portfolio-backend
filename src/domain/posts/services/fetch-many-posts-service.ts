import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../repositories/posts-repository';
import { Either, ok } from '@/core/types/either';
import { PaginationParams } from '@/core/types/pagination-params';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Post } from '../entities/post';

interface FetchManyPostsServiceRequest extends PaginationParams {}

type FetchManyPostsServiceResponse = Either<null, { posts: Post[] }>;

@Injectable()
export class FetchManyPostsService {
  constructor(private postsRepository: IPostsRepository) {}

  async exec({
    amount,
    page,
    query,
  }: FetchManyPostsServiceRequest): Promise<FetchManyPostsServiceResponse> {
    const posts = await this.postsRepository.findMany({
      amount: amount ?? QUANTITY_PER_PAGE,
      page: page ?? 1,
      query,
    });

    return ok({
      posts,
    });
  }
}
