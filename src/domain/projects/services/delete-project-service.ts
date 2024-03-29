import { Injectable } from '@nestjs/common';
import { IProjectsRepository } from '../repositories/projects-repository';
import { Either, fail, ok } from '@/core/types/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { UserRole } from '@/domain/users/entities/user';

interface DeleteProjectServiceRequest {
  userId: string;
  projectId: string;
}

type DeleteProjectServiceResponse = Either<ResourceNotFoundError, object>;

@Injectable()
export class DeleteProjectService {
  constructor(
    private projectsRepository: IProjectsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async exec({
    userId,
    projectId,
  }: DeleteProjectServiceRequest): Promise<DeleteProjectServiceResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return fail(new BadRequestError());
    }

    if (user.role !== UserRole.admin) {
      return fail(new UnauthorizedError());
    }

    const project = await this.projectsRepository.findById(projectId);

    if (!project) {
      return fail(new ResourceNotFoundError());
    }

    await this.projectsRepository.delete(project);

    return ok({});
  }
}
