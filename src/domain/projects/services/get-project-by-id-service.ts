import { Injectable } from '@nestjs/common';
import { IProjectsRepository } from '../repositories/projects-repository';
import { Either, ok } from '@/core/types/either';
import { Project } from '../entities/project';

interface GetProjectByIdServiceRequest {
  id: string;
}

type GetProjectByIdServiceResponse = Either<null, { project: Project | null }>;

@Injectable()
export class GetProjectByIdService {
  constructor(private projectsRepository: IProjectsRepository) {}

  async exec({
    id,
  }: GetProjectByIdServiceRequest): Promise<GetProjectByIdServiceResponse> {
    const project = await this.projectsRepository.findById(id);

    return ok({
      project,
    });
  }
}
