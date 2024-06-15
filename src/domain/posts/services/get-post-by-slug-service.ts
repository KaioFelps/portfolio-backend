import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../repositories/posts-repository';
import { Either, ok } from '@/core/types/either';
import { PostWithAuthor } from '../entities/value-objects/post-with-author';
import { TokenPayload } from '@/infra/auth/jwt-strategy';

interface GetPostBySlugServiceRequest {
  user: TokenPayload | null;
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
    user,
  }: GetPostBySlugServiceRequest): Promise<GetPostBySlugServiceResponse> {
    const post = await this.postsRepository.findBySlugWithAuthor(slug);

    if (!post?.publishedAt && !user) {
      return ok({ post: null });
    }

    return ok({
      post,
    });
  }
}
