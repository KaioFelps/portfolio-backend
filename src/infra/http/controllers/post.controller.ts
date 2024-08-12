import { GetPostBySlugService } from '@/domain/posts/services/get-post-by-slug-service';
import { PublicRoute } from '@/infra/auth/decorators/public-route';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { PostPresenter } from '../presenters/post-presenter';
import { FetchManyPostsService } from '@/domain/posts/services/fetch-many-posts-service';
import { PostWithAuthorPresenter } from '../presenters/post-with-author-presenter';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { TitleAndTagPaginatedQueryDto } from '../dtos/title-and-query-paginated-query';
import { CreatePostService } from '@/domain/posts/services/create-post-service';
import { CreatePostDto } from '../dtos/create-post';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { CurrentUser } from '@/infra/auth/decorators/current-user';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { EditPostService } from '@/domain/posts/services/edit-post-service';
import { UpdatePostDto } from '../dtos/update-post';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { DeletePostService } from '@/domain/posts/services/delete-post-service';
import { TogglePostVisibilityService } from '@/domain/posts/services/toggle-post-visibility-service';
import { FetchManyPublishedPostsService } from '@/domain/posts/services/fetch-many-published-posts-service';

@Controller('post')
export class PostController {
  constructor(
    private getPostBySlugService: GetPostBySlugService,
    private fetchManyPostsService: FetchManyPostsService,
    private fetchManyPublishedPostsService: FetchManyPublishedPostsService,
    private createPostService: CreatePostService,
    private editPostService: EditPostService,
    private deletePostService: DeletePostService,
    private togglePostVisibilityService: TogglePostVisibilityService,
  ) {}

  @Get('/:slug/show')
  @PublicRoute()
  @HttpCode(200)
  async get(
    @Param('slug') slug: string,
    @CurrentUser() user: TokenPayload | null,
  ) {
    const response = await this.getPostBySlugService.exec({
      slug,
      user,
    });

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
  async getMany(@Query() query: TitleAndTagPaginatedQueryDto) {
    const response = await this.fetchManyPublishedPostsService.exec(query);

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

  @Get('list/admin')
  @HttpCode(200)
  async adminGetMany(@Query() query: TitleAndTagPaginatedQueryDto) {
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
  @HttpCode(200)
  async update(
    @Body() body: UpdatePostDto,
    @Param('id') postId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const response = await this.editPostService.exec({
      ...body,
      authorId: user.sub,
      postId,
    });

    if (response.isFail()) {
      switch (response.value.constructor) {
        case BadRequestError:
          throw new BadRequestException(response.value.message);
        case UnauthorizedError:
          throw new UnauthorizedException(response.value.message);
        default:
          throw new InternalServerErrorException();
      }
    }

    const { post } = response.value;
    const mappedPost = PostPresenter.toHTTP(post);

    return { post: mappedPost };
  }

  @Patch('/:id/visibility')
  @HttpCode(204)
  async toggleVisibility(
    @Param('id') postId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const response = await this.togglePostVisibilityService.exec({
      authorId: user.sub,
      postId,
    });

    if (response.isFail()) {
      switch (response.value.constructor) {
        case BadRequestError:
          throw new BadRequestException(response.value.message);
        case UnauthorizedError:
          throw new UnauthorizedException(response.value.message);
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  @Delete('/:id/delete')
  @HttpCode(200)
  async delete(@Param('id') postId: string, @CurrentUser() user: TokenPayload) {
    const response = await this.deletePostService.exec({
      authorId: user.sub,
      postId,
    });

    if (response.isFail()) {
      switch (response.value.constructor) {
        case BadRequestError:
          throw new BadRequestException(response.value.message);
        case UnauthorizedError:
          throw new UnauthorizedException(response.value.message);
        default:
          throw new InternalServerErrorException();
      }
    }

    return { post: PostPresenter.toHTTP(response.value.post) };
  }
}
