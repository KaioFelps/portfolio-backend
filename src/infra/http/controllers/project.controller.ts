import { CreateProjectService } from '@/domain/projects/services/create-project-service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProjectDto } from '../dtos/create-project';
import { CurrentUser } from '@/infra/auth/decorators/current-user';
import { TokenPayload } from '@/infra/auth/jwt-strategy';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { UpdateProjectDto } from '../dtos/update-project';
import { EditProjectService } from '@/domain/projects/services/edit-project-service';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DeleteProjectService } from '@/domain/projects/services/delete-project-service';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { ProjectPresenter } from '../presenters/project-presenter';
import { PaginatedQueryDto } from '../dtos/paginated-query';
import { FetchManyProjectsService } from '@/domain/projects/services/fetch-many-projects-service';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { PublicRoute } from '@/infra/auth/decorators/public-route';

/*
import { ZodValidatorPipe } from '@/infra/lib/zod-validator-pipe';
import { z } from 'zod';

  // VALIDATION USING ZOD
  const createProjectBody = z.object({
    title: z.string(),
    topstory: z.string(),
    tags: z.string().array(),
    links: z.string().array(),
  });
  const createProjectBodyPipe = new ZodValidatorPipe(createProjectBody);
  type CreateProjectBody = z.infer<typeof createProjectBody>;

  @Post("/")
  async createProject(@Body(createProjectBodyPipe) body: CreateProjectBody) {}
  */

@Controller('project')
export class ProjectController {
  constructor(
    private createProjectService: CreateProjectService,
    private editProjectService: EditProjectService,
    private deleteProjectService: DeleteProjectService,
    private fetchManyProjectsService: FetchManyProjectsService,
  ) {}

  @Get('list')
  @PublicRoute()
  @HttpCode(200)
  async getMany(
    @Query()
    query: PaginatedQueryDto,
  ) {
    const result = await this.fetchManyProjectsService.exec(query);

    if (result.isFail()) {
      throw new InternalServerErrorException();
    }

    const { projects, count } = result.value;

    const formattedProjects = projects.map(ProjectPresenter.toHTTP);

    return {
      projects: formattedProjects,
      totalCount: count,
      page: query.page || 1,
      perPage: query.amount || QUANTITY_PER_PAGE,
    };
  }

  @Post('new')
  @HttpCode(201)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: TokenPayload,
  ) {
    const { links, tags, title, topstory } = createProjectDto;

    const result = await this.createProjectService.exec({
      links,
      tags,
      title,
      topstory,
      userId: user.sub,
    });

    if (result.isFail()) {
      switch (result.value.constructor) {
        case UnauthorizedError:
          throw new UnauthorizedException();
        default:
          throw new BadRequestException();
      }
    }

    return {
      project: ProjectPresenter.toHTTP(result.value.project),
    };
  }

  @Put('/:id/edit')
  @HttpCode(204)
  async update(
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: TokenPayload,
    @Param('id') projectId: string,
  ) {
    const result = await this.editProjectService.exec({
      userId: user.sub,
      projectId,
      ...updateProjectDto,
    });

    if (result.isFail()) {
      switch (result.value.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(result.value.message);
        default:
          throw new BadRequestException();
      }
    }
  }

  @Delete('/:id/delete')
  @HttpCode(204)
  async delete(
    @Param('id') projectId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const result = await this.deleteProjectService.exec({
      projectId,
      userId: user.sub,
    });

    if (result.isFail()) {
      switch (result.value.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException();
        case UnauthorizedError:
          throw new UnauthorizedException();
        case BadRequestError:
          throw new BadRequestError();
        default:
          throw new InternalServerErrorException();
      }
    }
  }
}
