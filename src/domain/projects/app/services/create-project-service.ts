import { Injectable } from '@nestjs/common';
import { IProjectsRepository } from '../repositories/projects-repository';
import { Project } from '../entities/project';

@Injectable()
export class CreateProjectService {
  constructor(private projectsRepository: IProjectsRepository) {}

  async exec(project: Project) {
    await this.projectsRepository.create(project);
  }
}
