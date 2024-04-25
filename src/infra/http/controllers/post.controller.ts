import { GetPostBySlugService } from '@/domain/posts/services/get-post-by-slug-service';
import { PublicRoute } from '@/infra/auth/decorators/public-route';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PostPresenter } from '../presenters/post-presenter';
import { FetchManyPostsService } from '@/domain/posts/services/fetch-many-posts-service';
import { PostWithAuthorPresenter } from '../presenters/post-with-author-presenter';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { PaginatedPostListDto } from '../dtos/paginated-post-list';
import { CreatePostService } from '@/domain/posts/services/create-post-service';
import { CreatePostDto } from '../dtos/create-post';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { CurrentUser } from '@/infra/auth/decorators/current-user';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

@Controller('post')
export class PostController {
  constructor(
    private getPostBySlugService: GetPostBySlugService,
    private fetchManyPostsService: FetchManyPostsService,
    private createPostService: CreatePostService,
  ) {}

  @Get('/:slug/show')
  @PublicRoute()
  @HttpCode(200)
  async get(@Param('slug') slug: string) {
    const response = await this.getPostBySlugService.exec({ slug });

    if (response.isFail()) {
      throw new InternalServerErrorException();
    }

    const { post: domainPostWithAuthor } = response.value;

    if (!domainPostWithAuthor) {
      return { post: null };
    }

    const postWithAuthor = PostWithAuthorPresenter.toHTTP(domainPostWithAuthor);

    return { post: postWithAuthor };
  }

  @Get('list')
  @PublicRoute()
  @HttpCode(200)
  async getMany(@Query() query: PaginatedPostListDto) {
    const response = await this.fetchManyPostsService.exec(query);

    if (response.isFail()) {
      throw new InternalServerErrorException();
    }

    const { count, posts } = response.value;

    const formattedPosts = posts.map(PostPresenter.toHTTP);

    return {
      posts: formattedPosts,
      totalCount: count,
      page: query.page ?? 1,
      perPage: query.amount ?? QUANTITY_PER_PAGE,
    };
  }

  @Post('new')
  @HttpCode(201)
  async create(@Body() body: CreatePostDto, @CurrentUser() user: TokenPayload) {
    const _authorId = body.authorId ?? user.sub;
    const authorId = new EntityUniqueId(_authorId);

    const response = await this.createPostService.exec({
      ...body,
      authorId,
    });

    if (response.isFail()) {
      switch (response.value.constructor) {
        case UnauthorizedError:
          throw new UnauthorizedException(response.value.message);
        default:
          throw new InternalServerErrorException();
      }
    }

    const { post } = response.value;

    return {
      post: PostPresenter.toHTTP(post),
    };
  }

  @Put('/:id/edit')
  async update() {
    throw new Error('Missing Post.update implementation.');
  }

  @Delete('/:id/delete')
  async delete() {
    throw new Error('Missing Post.delete implementation.');
  }
}
