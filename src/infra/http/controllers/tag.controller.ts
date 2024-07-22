import { CreateTagService } from '@/domain/tags/services/create-tag-service';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TagPresenter } from '../presenters/tag-presenter';
import { CreateTagDto } from '../dtos/create-tag';

@Controller('/tag')
export class TagsController {
  constructor(private createTagService: CreateTagService) {}

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
}
