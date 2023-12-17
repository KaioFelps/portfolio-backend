import { Injectable } from '@nestjs/common';
import { IProjectsRepository } from '../repositories/projects-repository';
import { Project } from '../entities/project';
import { Either, fail, ok } from '@/core/types/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface EditProjectServiceRequest {
  projectId: string;
  title?: string;
  topstory?: string;
  tags?: string[];
  links?: string[];
}

type EditProjectServiceResponse = Either<
  ResourceNotFoundError,
  { project: Project }
>;

@Injectable()
export class EditProjectService {
  constructor(private projectsRepository: IProjectsRepository) {}

  async exec({
    links,
    tags,
    title,
    topstory,
    projectId,
  }: EditProjectServiceRequest): Promise<EditProjectServiceResponse> {
    const project = await this.projectsRepository.findById(projectId);

    if (!project) {
      return fail(new ResourceNotFoundError());
    }

    project.links = links ?? project.links;
    project.tags = tags ?? project.tags;
    project.title = title ?? project.title;
    project.topstory = topstory ?? project.topstory;

    await this.projectsRepository.save(project);

    return ok({ project });
  }
}
