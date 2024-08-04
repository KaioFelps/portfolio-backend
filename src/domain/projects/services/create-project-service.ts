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
import { ITagsRepository } from '@/domain/tags/repositories/tag-repository';

interface CreateProjectServiceRequest {
  userId: string;
  title: string;
  topstory: string;
  /** tags ids */
  tags: string[];
  links: Array<{ title: string; value: string }>;
}

type CreateProjectServiceResponse = Either<
  UnauthorizedError,
  { project: Project }
>;

@Injectable()
export class CreateProjectService {
  constructor(
    private projectsRepository: IProjectsRepository,
    private tagsRepository: ITagsRepository,
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

    const tagsFromDb = await this.tagsRepository.findManyByIds(tags);

    const projectTagsList = new ProjectTagList(
      tagsFromDb.map((tag) =>
        ProjectTagFactory.exec({
          projectId: project.id,
          tag,
        }),
      ),
    );

    const projectLinksList = new ProjectLinkList(
      links.map(({ title, value }) =>
        ProjectLink.create({ projectId: project.id, value, title }),
      ),
    );

    project.tags = projectTagsList;
    project.links = projectLinksList;

    project.addCreatedEventToDispatch();

    try {
      await this.projectsRepository.create(project);
    } finally {
      project.dispose();
    }

    return ok({ project });
  }
}
