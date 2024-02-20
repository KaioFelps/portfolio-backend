import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../repositories/posts-repository';
import { Post } from '../entities/post';
import { Either, fail, ok } from '@/core/types/either';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { IPostTagsRepository } from '../repositories/post-tags-repository';
import { PostTagList } from '../entities/post-tag-list';
import { PostTag } from '../entities/post-tag';

interface EditPostServiceRequest {
  authorId: string;
  postId: string;
  title?: string;
  content?: string;
  topstory?: string;
  tags?: { value: string; id?: EntityUniqueId }[];
}

type EditPostServiceResponse = Either<
  BadRequestError | UnauthorizedError,
  { post: Post }
>;

@Injectable()
export class EditPostService {
  constructor(
    private postsRepository: IPostsRepository,
    private usersRepository: IUsersRepository,
    private postTagsRepository: IPostTagsRepository,
  ) {}

  async exec({
    authorId,
    content,
    postId,
    tags = [],
    title,
    topstory,
  }: EditPostServiceRequest): Promise<EditPostServiceResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return fail(new BadRequestError());
    }

    const user = await this.usersRepository.findById(authorId);

    if (!user) {
      return fail(new BadRequestError());
    }

    if (!post.authorId.equals(new EntityUniqueId(authorId))) {
      return fail(new UnauthorizedError());
    }

    const currentTags = await this.postTagsRepository.findManyByPostId(post.id);

    const currentTagsList = new PostTagList(currentTags);

    const newTags = tags.map((tag) =>
      PostTag.create({ postId: post.id, value: tag.value }, tag.id),
    );

    currentTagsList.update(newTags);

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.topstory = topstory ?? post.topstory;
    post.tags = currentTagsList;

    await this.postsRepository.save(post);

    return ok({ post });
  }
}
