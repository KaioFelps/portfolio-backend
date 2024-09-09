import { Injectable } from '@nestjs/common';
import { IPostsRepository, PostQuery } from '../repositories/posts-repository';
import { Either, ok } from '@/core/types/either';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Post } from '../entities/post';
import { PaginationParams } from '@/core/types/pagination-params';
import { ITagsRepository } from '@/domain/tags/repositories/tag-repository';

interface FetchManyPostsServiceRequest
  extends Omit<PaginationParams, keyof { query?: string }> {
  title?: string;
  tag?: string;
}

type FetchManyPostsServiceResponse = Either<
  null,
  { posts: Post[]; count: number }
>;

@Injectable()
export class FetchManyPostsService {
  constructor(
    private postsRepository: IPostsRepository,
    private tagsRepository: ITagsRepository,
  ) {}

  async exec({
    amount,
    page,
    title,
    tag,
  }: FetchManyPostsServiceRequest): Promise<FetchManyPostsServiceResponse> {
    let query: PostQuery | undefined;

    if (title) {
      query = new PostQuery('title', title);
    } else if (tag) {
      const tagFromDb = await this.tagsRepository.findByValue(tag);
      if (!tagFromDb)
        return ok({
          posts: [],
          count: 0,
        });

      query = new PostQuery('tag', tagFromDb.id.toValue());
    }

    const { value: posts, totalCount } = await this.postsRepository.findMany({
      amount: amount ?? QUANTITY_PER_PAGE,
      page: page ?? 1,
      query,
    });

    return ok({
      posts,
      count: totalCount,
    });
  }
}
