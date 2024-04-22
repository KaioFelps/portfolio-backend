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

@Controller('post')
export class PostController {
  constructor(private getPostBySlug: GetPostBySlugService) {}

  @Get('/:slug/show')
  @PublicRoute()
  @HttpCode(200)
  async get(@Param('slug') slug: string) {
    const response = await this.getPostBySlug.exec({ slug });

    if (response.isFail()) {
      throw new InternalServerErrorException();
    }

    const { post: domainPostWithAuthor } = response.value;

    if (!domainPostWithAuthor) {
      return { post: null };
    }

    const postWithAuthor = PostPresenter.toHTTP(domainPostWithAuthor);

    return { post: postWithAuthor };
  }

  @Get('list')
  async getMany(@Query() _query: PaginatedQueryDto) {
    throw new Error('Missing Post.getMany implementation.');
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
