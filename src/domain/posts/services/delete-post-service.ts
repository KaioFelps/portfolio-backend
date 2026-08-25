import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../repositories/posts-repository';
import { Either, fail, ok } from '@/core/types/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { UserRole } from '@/domain/users/entities/user';
import { Post } from '../entities/post';
import { ForbiddenError } from '@/core/errors/forbidden-error';

interface DeletePostServiceRequest {
  authorId: string;
  postId: string;
}

type DeletePostServiceResponse = Either<
  UnauthorizedError | ForbiddenError,
  { }
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
      return fail(new BadRequestError("Você precisa estar logado para isso."));
    }

    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return ok({});
    }

    if (!post.authorId.equals(user.id) && user.role !== UserRole.admin) {
      return fail(new ForbiddenError("Você não está autorizado a remover essa publicação."));
    }

    post.addDeletedEventToDispatch();

    try {
      await this.postsRepository.delete(post);
    } finally {
      post.dispose();
    }

    return ok({});
  }
}
