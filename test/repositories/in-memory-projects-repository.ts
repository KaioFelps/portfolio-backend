import { DomainEvents } from '@/core/events/domain-events';
import { Project } from '@/domain/projects/entities/project';
import {
  IProjectsRepository,
  ProjectListPaginationParams,
} from '@/domain/projects/repositories/projects-repository';
import { InMemoryProjectLinksRepository } from './in-memory-project-links-repository';
import { InMemoryProjectTagsRepository } from './in-memory-project-tags-repository';
import { PaginationResponse } from '@/core/types/pagination-responses';

export class InMemoryProjectsRepository implements IProjectsRepository {
  public items: Project[] = [];

  constructor(
    private projectTagsRepository: InMemoryProjectTagsRepository,
    private projectLinksRepository: InMemoryProjectLinksRepository,
  ) {}

  async create(project: Project): Promise<void> {
    this.items.push(project);

    this.projectLinksRepository.createMany(project.links.getItems());
    this.projectTagsRepository.createMany(project.tags.getItems());

    DomainEvents.dispatchEventsForAggregate(project.id);
  }

  async findById(id: string): Promise<Project | null> {
    return this.items.find((item) => item.id.toValue() === id) || null;
  }

  async findMany({
    amount: itemsPerPage = 9,
    page = 1,
    query,
  }: ProjectListPaginationParams): Promise<PaginationResponse<Project>> {
    let projects: Project[] = [];

    if (query) {
      switch (query.type) {
        case 'tag':
          projects = this.items.filter((item) =>
            item.tags
              .getItems()
              .find((tag) => tag.tag.id.toValue() === query.value),
          );
          break;
        case 'title':
          projects = this.items.filter((item) =>
            item.title.toLowerCase().includes(query.value.toLowerCase()),
          );
          break;
      }
    } else {
      projects = this.items;
    }

    const projectsTotalCount = projects.length;

    projects = projects.slice((page - 1) * itemsPerPage, itemsPerPage * page);

    return { value: projects, totalCount: projectsTotalCount };
  }

  async save(project: Project): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(project.id),
    );

    this.items[itemIndex] = project;

    await Promise.all([
      this.projectLinksRepository.deleteMany(project.links.getItems()),
      this.projectLinksRepository.createMany(project.links.getItems()),
      this.projectTagsRepository.deleteMany(project.tags.getItems()),
      this.projectTagsRepository.createMany(project.tags.getItems()),
    ]);

    DomainEvents.dispatchEventsForAggregate(project.id);
  }

  async delete(project: Project): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.equals(project));

    this.items.splice(itemIndex, 1);

    DomainEvents.dispatchEventsForAggregate(project.id);
  }
}
