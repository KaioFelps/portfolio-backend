import {
  BadRequestException,
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
import { CreateUserDto } from '../dtos/create-user';
import { CreateUserService } from '@/domain/users/services/create-user-service';
import { UserRole } from '@/domain/users/entities/user';
import { CurrentUser } from '@/infra/auth/decorators/current-user';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { UpdateUserDto } from '../dtos/update-user';
import { EditUserService } from '@/domain/users/services/edit-user-service';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { DeleteUserService } from '@/domain/users/services/delete-user-service';
import { UserPresenter } from '../presenters/user-presenter';
import { FetchManyUsersService } from '@/domain/users/services/fetch-many-users-service';
import { PaginatedQueryDto } from '../dtos/paginated-query';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';

@Controller('user')
export class UserController {
  constructor(
    private createUserService: CreateUserService,
    private editUserService: EditUserService,
    private deleteUserService: DeleteUserService,
    private fetchManyUsersService: FetchManyUsersService,
  ) {}

  @Get('list')
  @HttpCode(200)
  async getMany(
    @Query()
    query: PaginatedQueryDto,
  ) {
    const result = await this.fetchManyUsersService.exec(query);

    if (result.isFail()) {
      throw new InternalServerErrorException();
    }

    const formattedUsers = result.value.users.map(UserPresenter.toHTTP);

    return {
      users: formattedUsers,
      totalCount: result.value.count,
      page: query.page || 1,
      perPage: query.amount || QUANTITY_PER_PAGE,
    };
  }

  @Post('new')
  @HttpCode(201)
  async create(@Body() body: CreateUserDto, @CurrentUser() user: TokenPayload) {
    const result = await this.createUserService.exec({
      ...body,
      role: UserRole.editor,
      adminId: user.sub,
    });

    if (result.isFail()) {
      throw new UnauthorizedException();
    }

    const { user: createdUser } = result.value;

    return {
      user: UserPresenter.toHTTP(createdUser),
    };
  }

  @Put('/:id/edit')
  @HttpCode(204)
  async update(
    @Body() body: UpdateUserDto,
    @CurrentUser() user: TokenPayload,
    @Param('id') beingEditedUserId: string,
  ) {
    const result = await this.editUserService.exec({
      ...body,
      adminId: user.sub,
      userId: beingEditedUserId,
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
  }

  @Delete('/:id/delete')
  @HttpCode(204)
  async delete(
    @CurrentUser() user: TokenPayload,
    @Param('id') beingDeletedUserId: string,
  ) {
    const result = await this.deleteUserService.exec({
      adminId: user.sub,
      userId: beingDeletedUserId,
    });

    if (result.isFail()) {
      throw new UnauthorizedException();
    }
  }
}
