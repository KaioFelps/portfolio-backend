import { Injectable } from '@nestjs/common';
import { IPostsRepository, PostQuery } from '../repositories/posts-repository';
import { Either, fail, ok } from '@/core/types/either';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Post } from '../entities/post';
import { PaginationParams } from '@/core/types/pagination-params';
import { ITagsRepository } from '@/domain/tags/repositories/tag-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface FetchManyPublishedPostsServiceRequest
  extends Omit<PaginationParams, keyof { query?: string }> {
  title?: string;
  tag?: string;
}

type FetchManyPublishedPostsServiceResponse = Either<
  ResourceNotFoundError,
  { posts: Post[]; count: number }
>;

@Injectable()
export class FetchManyPublishedPostsService {
  constructor(
    private postsRepository: IPostsRepository,
    private tagsRepository: ITagsRepository,
  ) {}

  async exec({
    amount,
    page,
    title,
    tag,
  }: FetchManyPublishedPostsServiceRequest): Promise<FetchManyPublishedPostsServiceResponse> {
    let query: PostQuery | undefined;

    if (title) {
      query = new PostQuery('title', title);
    } else if (tag) {
      const tagFromDb = await this.tagsRepository.findByValue(tag);

      if (!tagFromDb) return fail(new ResourceNotFoundError());

      query = new PostQuery('tag', tagFromDb.id.toValue());
    }

    const { value: posts, totalCount } =
      await this.postsRepository.findManyPublished({
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
