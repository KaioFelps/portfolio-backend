import { Injectable } from '@nestjs/common';
import { IProjectsRepository } from '../repositories/projects-repository';
import { Project } from '../entities/project';
import { Either, fail, ok } from '@/core/types/either';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { ProjectLinkList } from '../entities/project-link-list';
import { ProjectLink } from '../entities/project-link';
import { ProjectTagList } from '../entities/project-tag-list';
import { ProjectTagFactory } from 'test/factories/project-tag-factory';

interface CreateProjectServiceRequest {
  userId: string;
  title: string;
  topstory: string;
  tags: string[];
  links: string[];
}

type CreateProjectServiceResponse = Either<
  UnauthorizedError,
  { project: Project }
>;

@Injectable()
export class CreateProjectService {
  constructor(
    private projectsRepository: IProjectsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async exec({
    userId,
    links = [],
    tags = [],
    title,
    topstory,
  }: CreateProjectServiceRequest): Promise<CreateProjectServiceResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return fail(new UnauthorizedError());
    }

    const project = Project.create({
      title,
      topstory,
    });

    const projectTagsList = new ProjectTagList(
      tags.map((tag) =>
        ProjectTagFactory.exec({
          projectId: project.id,
          value: tag,
        }),
      ),
    );

    const projectLinksList = new ProjectLinkList(
      links.map((link) =>
        ProjectLink.create({ projectId: project.id, value: link }),
      ),
    );

    project.tags = projectTagsList;
    project.links = projectLinksList;

    await this.projectsRepository.create(project);

    return ok({ project });
  }
}
