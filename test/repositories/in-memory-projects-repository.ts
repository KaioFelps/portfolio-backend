import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/types/pagination-params';
import { Project } from '@/domain/projects/entities/project';
import { IProjectsRepository } from '@/domain/projects/repositories/projects-repository';
import { InMemoryProjectLinksRepository } from './in-memory-project-links-repository';
import { InMemoryProjectTagsRepository } from './in-memory-project-tags-repository';
import { InMemoryTagsRepository } from './in-memory-tags-repository';

export class InMemoryProjectsRepository implements IProjectsRepository {
  public items: Project[] = [];

  constructor(
    private projectTagsRepository: InMemoryProjectTagsRepository,
    private projectLinksRepository: InMemoryProjectLinksRepository,
    private tagsRepository: InMemoryTagsRepository,
  ) {}

  async create(project: Project): Promise<void> {
    this.items.push(project);

    this.projectLinksRepository.createMany(project.links.getItems());
    this.projectTagsRepository.createMany(project.tags.getItems());

    DomainEvents.dispatchEventsForAggregate(project.id);
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

        let itemFromLoop = null;

        item.tags.getItems().forEach(async (tag) => {
          const foundTag = await this.tagsRepository.findById(tag.id);

          if (foundTag && foundTag.value === query) {
            itemFromLoop = tag;
          }
        });

        if (itemFromLoop !== null) {
          return itemFromLoop;
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

  async delete(project: Project): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.equals(project));

    this.items.splice(itemIndex, 1);
  }
}
