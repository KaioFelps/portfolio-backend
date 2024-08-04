import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../repositories/posts-repository';
import { Post } from '../entities/post';
import { Either, fail, ok } from '@/core/types/either';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';

interface TogglePostVisibilityServiceRequest {
  authorId: string;
  postId: string;
}

type TogglePostVisibilityServiceResponse = Either<
  BadRequestError | UnauthorizedError,
  { post: Post }
>;

@Injectable()
export class TogglePostVisibilityService {
  constructor(
    private postsRepository: IPostsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async exec({
    postId,
    authorId,
  }: TogglePostVisibilityServiceRequest): Promise<TogglePostVisibilityServiceResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return fail(new BadRequestError());
    }

    const user = await this.usersRepository.findById(authorId);

    if (!user) {
      return fail(new UnauthorizedError());
    }

    post.publishedAt = post.publishedAt ? null : new Date();

    try {
      await this.postsRepository.save(post);
    } finally {
      post.dispose();
    }

    return ok({ post });
  }
}
