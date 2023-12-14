import { PaginationParams } from '@/core/types/pagination-params';
import { Project } from '@/domain/projects/entities/project';
import { IProjectsRepository } from '@/domain/projects/repositories/projects-repository';

export class InMemoryProjectsRepository implements IProjectsRepository {
  public items: Project[] = [];

  async create(project: Project): Promise<void> {
    this.items.push(project);
  }

  async findById(id: string): Promise<Project> {
    return this.items.find((item) => item.id.toValue() === id);
  }

  async findMany({
    amount: itemsPerPage,
    page,
    query,
  }: PaginationParams): Promise<Project[]> {
    let projects: Project[] = [];

    if (query) {
      projects = this.items.filter((item) => {
        if (item.title.includes(query.trim())) {
          return item;
        }

        if (item.tags.includes(query)) {
          return item;
        }

        return null;
      });
    } else {
      projects = this.items;
    }

    projects = projects.slice((page - 1) * itemsPerPage, itemsPerPage * page);

    return projects;
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
