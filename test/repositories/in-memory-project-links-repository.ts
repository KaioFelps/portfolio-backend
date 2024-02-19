import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { ProjectLink } from '@/domain/projects/entities/project-link';
import { IProjectLinksRepository } from '@/domain/projects/repositories/project-links-repository';

export class InMemoryProjectLinksRepository implements IProjectLinksRepository {
  public items: ProjectLink[] = [];

  async createMany(links: ProjectLink[]): Promise<void> {
    this.items.push(...links);
  }

  async deleteMany(links: ProjectLink[]): Promise<void> {
    const newItems = this.items.filter((item) => {
      return !links.some((link) => link.equals(item));
    });

    this.items = newItems;
  }

  async findManyByProjectId(projectId: EntityUniqueId): Promise<ProjectLink[]> {
    const foundItems = this.items.filter((item) =>
      item.projectId.equals(projectId),
    );

    return foundItems;
  }
}
