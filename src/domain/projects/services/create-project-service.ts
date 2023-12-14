import { Injectable } from '@nestjs/common';
import { IProjectsRepository } from '../repositories/projects-repository';
import { Project } from '../entities/project';
import { Either, ok } from '@/core/types/either';

interface CreateProjectServiceRequest {
  title: string;
  topstory: string;
  tags: string[];
  links: string[];
}

type CreateProjectServiceResponse = Either<null, Project>;

@Injectable()
export class CreateProjectService {
  constructor(private projectsRepository: IProjectsRepository) {}

  async exec({
    links,
    tags,
    title,
    topstory,
  }: CreateProjectServiceRequest): Promise<CreateProjectServiceResponse> {
    const project = Project.create({
      links,
      tags,
      title,
      topstory,
    });

    await this.projectsRepository.create(project);

    return ok(project);
  }
}
