import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../repositories/posts-repository';
import { Post } from '../entities/post';
import { Either, fail, ok } from '@/core/types/either';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { PostTag } from '../entities/post-tag';
import { PostTagList } from '../entities/post-tag-list';
import { ITagsRepository } from '@/domain/tags/repositories/tag-repository';

interface CreateLogServiceRequest {
  title: string;
  description: string;
  content: string;
  authorId: EntityUniqueId;
  topstory: string;
  /** tags ids */
  tags: string[];
}

type CreateLogServiceResponse = Either<UnauthorizedError, { post: Post }>;

@Injectable()
export class CreatePostService {
  constructor(
    private postsRepository: IPostsRepository,
    private usersRepository: IUsersRepository,
    private tagsRepository: ITagsRepository,
  ) {}

  async exec({
    authorId,
    content,
    description,
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
      description,
      content,
      title,
      topstory,
      tags: new PostTagList(),
    });

    const tagsFromDb = await this.tagsRepository.findManyByIds(tags);

    const postTags = tagsFromDb.map((tag) =>
      PostTag.create({
        postId: post.id,
        tag,
      }),
    );

    const postTagsList = new PostTagList(postTags);

    post.tags = postTagsList;

    post.updatedAt = null;

    post.addCreatedEventToDispatch();

    try {
      await this.postsRepository.create(post);
    } finally {
      post.dispose();
    }

    return ok({ post });
  }
}
