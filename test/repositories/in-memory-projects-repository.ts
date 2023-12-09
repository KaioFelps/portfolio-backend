import { Project } from '@/domain/projects/app/entities/project';
import { IProjectsRepository } from '@/domain/projects/app/repositories/projects-repository';

export class InMemoryProjectsRepository implements IProjectsRepository {
  public items: Project[] = [];

  async create(project: Project): Promise<void> {
    this.items.push(project);
  }
}
