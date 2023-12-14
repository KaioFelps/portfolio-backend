import { CreateProjectService } from '@/domain/projects/app/services/create-project-service';
import { ZodValidatorPipe } from '@/infra/lib/zod-validator-pipe';
import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';

// CREATE PROJECT TYPOS ===
const createProjectBody = z.object({
  title: z.string(),
  topstory: z.string(),
  tags: z.string().array(),
  links: z.string().array(),
});
const createProjectBodyPipe = new ZodValidatorPipe(createProjectBody);
type CreateProjectBody = z.infer<typeof createProjectBody>;

@Controller('/projects')
export class ProjectsController {
  constructor(private createProjectService: CreateProjectService) {}

  @Post('new')
  async createProject(@Body(createProjectBodyPipe) body: CreateProjectBody) {
    const { links, tags, title, topstory } = body;

    await this.createProjectService.exec({
      links,
      tags,
      title,
      topstory,
    });
  }
}
