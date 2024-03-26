import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../repositories/posts-repository';
import { Either, ok } from '@/core/types/either';
import { Post } from '../entities/post';

interface GetPostBySlugServiceRequest {
  slug: string;
}

type GetPostBySlugServiceResponse = Either<null, { post: Post | null }>;

@Injectable()
export class GetPostBySlugService {
  constructor(private postsRepository: IPostsRepository) {}

  async exec({
    slug,
  }: GetPostBySlugServiceRequest): Promise<GetPostBySlugServiceResponse> {
    const post = await this.postsRepository.findBySlug(slug);

    return ok({
      post,
    });
  }
}
