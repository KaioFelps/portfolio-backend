import { CreateProjectService } from '@/domain/projects/services/create-project-service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateProjectDto } from '../dtos/create-project';
import { CurrentUser } from '@/infra/auth/decorators/current-user';
import { TokenPayload } from '@/infra/auth/jwt-strategy';

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

@Controller('/projects')
export class ProjectsController {
  constructor(private createProjectService: CreateProjectService) {}

  @Post('new')
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: TokenPayload,
  ) {
    const { links, tags, title, topstory } = createProjectDto;

    await this.createProjectService.exec({
      links,
      tags,
      title,
      topstory,
      userId: user.sub,
    });
  }
}
