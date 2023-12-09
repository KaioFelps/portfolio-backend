import { Project } from '@/domain/projects/app/entities/project';
import { IProjectsRepository } from '@/domain/projects/app/repositories/projects-repository';

export class InMemoryProjectsRepository implements IProjectsRepository {
  public items: Project[] = [];

  async create(project: Project): Promise<void> {
    this.items.push(project);
  }

  async findById(id: string): Promise<Project> {
    return this.items.find((item) => item.id.toValue() === id);
  }

  async save(project: Project): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(project.id),
    );

    this.items[itemIndex] = project;
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toValue() === id);

    this.items.splice(itemIndex, 1);
  }
}
