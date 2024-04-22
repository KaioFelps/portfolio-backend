import { GetPostBySlugService } from '@/domain/posts/services/get-post-by-slug-service';
import { PublicRoute } from '@/infra/auth/decorators/public-route';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaginatedQueryDto } from '../dtos/paginated-query';
import { PostPresenter } from '../presenters/post-presenter';
import { FetchManyPostsService } from '@/domain/posts/services/fetch-many-posts-service';
import { PostWithAuthorPresenter } from '../presenters/post-with-author-presenter';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';

@Controller('post')
export class PostController {
  constructor(
    private getPostBySlugService: GetPostBySlugService,
    private fetchManyPostsService: FetchManyPostsService,
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
  async getMany(@Query() query: PaginatedQueryDto) {
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
  async create() {
    throw new Error('Missing Post.create implementation.');
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
