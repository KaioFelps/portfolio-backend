import { CreateTagService } from '@/domain/tags/services/create-tag-service';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  Get,
  Patch,
  Delete,
  Query,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TagPresenter } from '../presenters/tag-presenter';
import { CreateTagDto } from '../dtos/create-tag';
import { FetchManyTagsService } from '@/domain/tags/services/fetch-many-tags-service';
import { PaginatedQueryDto } from '../dtos/paginated-query';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { UpdateTagDto } from '../dtos/update-tag';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { CurrentUser } from '@/infra/auth/decorators/current-user';
import { PublicRoute } from '@/infra/auth/decorators/public-route';
import { EditTagService } from '@/domain/tags/services/edit-tag-service';
import { DeleteTagService } from '@/domain/tags/services/delete-tag-service';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { BadRequestError } from '@/core/errors/bad-request-error';

@Controller('/tag')
export class TagsController {
  constructor(
    private createTagService: CreateTagService,
    private fetchManyTagsService: FetchManyTagsService,
    private editTagService: EditTagService,
    private deleteTagService: DeleteTagService,
  ) {}

  @Post('/new')
  @HttpCode(201)
  async create(@Body() body: CreateTagDto) {
    try {
      const result = await this.createTagService.exec(body);

      if (result.isFail()) {
        throw new InternalServerErrorException();
      }

      return { tag: TagPresenter.toHTTP(result.value.tag) };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException(e.message);
      }

      throw new InternalServerErrorException();
    }
  }

  @Get('/list')
  @HttpCode(200)
  @PublicRoute()
  async list(@Query() query: PaginatedQueryDto) {
    const result = await this.fetchManyTagsService.exec(query);

    if (result.isFail()) {
      throw new InternalServerErrorException();
    }

    const formattedTags = result.value.tags.map(TagPresenter.toHTTP);

    return {
      tags: formattedTags,
      totalCount: result.value.count,
      page: query.page || 1,
      perPage: query.amount || QUANTITY_PER_PAGE,
    };
  }

  @Patch('/:id/edit')
  @HttpCode(200)
  async update(
    @Body() body: UpdateTagDto,
    @CurrentUser() user: TokenPayload,
    @Param('id') tagId: string,
  ) {
    const result = await this.editTagService.exec({
      tagId,
      value: body.value,
    });

    if (result.isFail()) {
      switch (result.value.constructor) {
        case UnauthorizedError:
          throw new UnauthorizedException();
        case BadRequestError:
          throw new BadRequestException();
        default:
          throw new BadRequestError();
      }
    }

    return { tag: TagPresenter.toHTTP(result.value.tag) };
  }

  @Delete('/:id/delete')
  @HttpCode(204)
  async delete(@CurrentUser() user: TokenPayload, @Param('id') tagId: string) {
    const result = await this.deleteTagService.exec({
      userId: user.sub,
      tagId,
    });

    if (result.isFail()) {
      throw new UnauthorizedException();
    }
  }
}
