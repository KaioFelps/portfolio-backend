import { Injectable } from '@nestjs/common';
import { IProjectsRepository } from '../repositories/projects-repository';
import { Project } from '../entities/project';
import { Either, fail, ok } from '@/core/types/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ProjectLinkList } from '../entities/project-link-list';
import { ProjectLink } from '../entities/project-link';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { IProjectLinksRepository } from '../repositories/project-links-repository';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { IProjectTagsRepository } from '../repositories/project-tags-repository';
import { ProjectTagList } from '../entities/project-tag-list';
import { ProjectTag } from '../entities/project-tag';
import { ITagsRepository } from '@/domain/tags/repositories/tag-repository';

interface EditProjectServiceRequest {
  userId: string;
  projectId: string;
  title?: string;
  topstory?: string;
  tags?: string[] | null;
  links?: Array<{ title: string; value: string }> | null;
}

type EditProjectServiceResponse = Either<
  ResourceNotFoundError,
  { project: Project }
>;

@Injectable()
export class EditProjectService {
  constructor(
    private tagsRepository: ITagsRepository,
    private projectsRepository: IProjectsRepository,
    private projectLinksRepository: IProjectLinksRepository,
    private projectTagsRepository: IProjectTagsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async exec({
    userId,
    title,
    topstory,
    projectId,
    tags = null,
    links = null,
  }: EditProjectServiceRequest): Promise<EditProjectServiceResponse> {
    const entityProjectId = new EntityUniqueId(projectId);
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return fail(new UnauthorizedError());
    }

    const project = await this.projectsRepository.findById(projectId);

    if (!project) {
      return fail(new ResourceNotFoundError());
    }

    const currentLinks =
      await this.projectLinksRepository.findManyByProjectId(entityProjectId);
    const currentLinksList = new ProjectLinkList(currentLinks);

    const newLinks = links
      ? links.map(({ title, value }) =>
          ProjectLink.create({
            projectId: entityProjectId,
            value,
            title,
          }),
        )
      : null;

    currentLinksList.update(newLinks);

    const currentTags =
      await this.projectTagsRepository.findManyByProjectId(entityProjectId);

    const currentTagsList = new ProjectTagList(currentTags);

    // save only tags that really exists
    // avoiding user to input unexisting tag's ID

    if (tags) {
      const newTags = await this.tagsRepository.findManyByIds(tags);
      const newProjectTags = newTags.map((tag) =>
        ProjectTag.create({
          projectId: entityProjectId,
          tag,
        }),
      );

      currentTagsList.update(newProjectTags);
    }

    project.title = title ?? project.title;
    project.topstory = topstory ?? project.topstory;
    project.links = currentLinksList;
    project.tags = currentTagsList;

    project.addEditedEventToDispatch();

    try {
      await this.projectsRepository.save(project);
    } finally {
      project.dispose();
    }

    return ok({ project });
  }
}
