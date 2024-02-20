import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../repositories/posts-repository';
import { Post } from '../entities/post';
import { Either, fail, ok } from '@/core/types/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { PostTag } from '../entities/post-tag';
import { PostTagList } from '../entities/post-tag-list';

interface CreateLogServiceRequest {
  title: string;
  content: string;
  authorId: EntityUniqueId;
  topstory: string;
  tags: string[];
}

type CreateLogServiceResponse = Either<UnauthorizedError, { post: Post }>;

@Injectable()
export class CreatePostService {
  constructor(
    private postsRepository: IPostsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async exec({
    authorId,
    content,
    tags,
    title,
    topstory,
  }: CreateLogServiceRequest): Promise<CreateLogServiceResponse> {
    const user = await this.usersRepository.findById(authorId.toValue());

    if (!user) {
      return fail(new UnauthorizedError());
    }

    const post = Post.create({
      authorId,
      content,
      title,
      topstory,
      tags: new PostTagList(),
    });

    const postTags = tags.map((tag) =>
      PostTag.create({
        postId: post.id,
        value: tag,
      }),
    );

    const postTagsList = new PostTagList(postTags);

    post.tags = postTagsList;

    await this.postsRepository.create(post);

    return ok({ post });
  }
}
