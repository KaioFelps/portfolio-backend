import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../repositories/posts-repository';
import { Either, fail, ok } from '@/core/types/either';
import { PostWithAuthor } from '../entities/value-objects/post-with-author';
import { BadRequestError } from '@/core/errors/bad-request-error';

interface GetPostBySlugServiceRequest {
  authorId?: string;
  slug: string;
}

type GetPostBySlugServiceResponse = Either<
  BadRequestError,
  { post: PostWithAuthor | null }
>;

@Injectable()
export class GetPostBySlugService {
  constructor(private postsRepository: IPostsRepository) {}

  async exec({
    slug,
    authorId,
  }: GetPostBySlugServiceRequest): Promise<GetPostBySlugServiceResponse> {
    const post = await this.postsRepository.findBySlugWithAuthor(slug);

    if (!post?.publishedAt && !authorId) {
      return fail(new BadRequestError());
    }

    return ok({
      post,
    });
  }
}
