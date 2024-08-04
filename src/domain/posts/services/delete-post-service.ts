import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../repositories/posts-repository';
import { Either, fail, ok } from '@/core/types/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { UserRole } from '@/domain/users/entities/user';
import { Post } from '../entities/post';

interface DeletePostServiceRequest {
  authorId: string;
  postId: string;
}

type DeletePostServiceResponse = Either<
  UnauthorizedError | BadRequestError,
  { post: Post }
>;

@Injectable()
export class DeletePostService {
  constructor(
    private postsRepository: IPostsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async exec({
    authorId,
    postId,
  }: DeletePostServiceRequest): Promise<DeletePostServiceResponse> {
    const user = await this.usersRepository.findById(authorId);

    if (!user) {
      return fail(new BadRequestError());
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return fail(new BadRequestError());
    }

    if (!post.authorId.equals(user.id) && user.role !== UserRole.admin) {
      return fail(new UnauthorizedError());
    }

    post.addDeletedEventToDispatch();

    try {
      await this.postsRepository.delete(post);
    } finally {
      post.dispose();
    }

    return ok({ post });
  }
}
