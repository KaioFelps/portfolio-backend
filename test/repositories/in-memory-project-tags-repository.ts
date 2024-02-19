import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { ITagsRepository } from '@/core/repositories/tags-repository';
import { ProjectTag } from '@/domain/projects/entities/project-tag';
import { IProjectTagsRepository } from '@/domain/projects/repositories/project-tags-repository';

export class InMemoryProjectTagsRepository implements IProjectTagsRepository {
  public items: ProjectTag[] = [];

  constructor(private tagsRepository: ITagsRepository) {}

  async createMany(tags: ProjectTag[]): Promise<void> {
    this.items.push(...tags);
  }

  async deleteMany(tags: ProjectTag[]): Promise<void> {
    const newItems = this.items.filter((item) => {
      return !tags.some((tag) => tag.equals(item));
    });

    this.items = newItems;
  }

  async findManyByProjectId(projectId: EntityUniqueId): Promise<ProjectTag[]> {
    const foundItems = this.items.filter((item) =>
      item.projectId.equals(projectId),
    );

    return foundItems;
  }
}
