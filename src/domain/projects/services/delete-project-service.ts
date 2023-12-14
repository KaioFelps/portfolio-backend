import { Injectable } from '@nestjs/common';
import { IProjectsRepository } from '../repositories/projects-repository';
import { Either, fail, ok } from '@/core/types/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface DeleteProjectServiceRequest {
  projectId: string;
  title?: string;
  topstory?: string;
  tags?: string[];
  links?: string[];
}

type DeleteProjectServiceResponse = Either<ResourceNotFoundError, object>;

@Injectable()
export class DeleteProjectService {
  constructor(private projectsRepository: IProjectsRepository) {}

  async exec({
    projectId,
  }: DeleteProjectServiceRequest): Promise<DeleteProjectServiceResponse> {
    const project = await this.projectsRepository.findById(projectId);

    if (!project) {
      return fail(new ResourceNotFoundError());
    }

    await this.projectsRepository.delete(projectId);

    return ok({});
  }
}
