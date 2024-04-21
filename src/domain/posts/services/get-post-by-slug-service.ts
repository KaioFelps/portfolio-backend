import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../repositories/posts-repository';
import { Either, ok } from '@/core/types/either';
import { PostWithAuthor } from '../entities/value-objects/post-with-author';

interface GetPostBySlugServiceRequest {
  slug: string;
}

type GetPostBySlugServiceResponse = Either<
  null,
  { post: PostWithAuthor | null }
>;

@Injectable()
export class GetPostBySlugService {
  constructor(private postsRepository: IPostsRepository) {}

  async exec({
    slug,
  }: GetPostBySlugServiceRequest): Promise<GetPostBySlugServiceResponse> {
    const post = await this.postsRepository.findBySlugWithAuthor(slug);

    return ok({
      post,
    });
  }
}
