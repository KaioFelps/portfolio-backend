import { Project } from '@/domain/projects/entities/project';
import {
  IProjectsRepository,
  ProjectListPaginationParams,
} from '@/domain/projects/repositories/projects-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { PrismaProjectMapper } from '../mappers/prisma-project-mapper';
import { DomainEvents } from '@/core/events/domain-events';
import { IProjectLinksRepository } from '@/domain/projects/repositories/project-links-repository';
import { IProjectTagsRepository } from '@/domain/projects/repositories/project-tags-repository';
import { PaginationResponse } from '@/core/types/pagination-responses';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaProjectsRepository implements IProjectsRepository {
  constructor(
    private prisma: PrismaService,
    private prismaProjectTagsRepository: IProjectTagsRepository,
    private prismaProjectLinksRepository: IProjectLinksRepository,
  ) {}

  async create(project: Project): Promise<void> {
    // the best would be this to be inside the Promise.all, but the links and tags needs the project to
    // have been already created so that they can use it's id as foreign key
    // creating the project together with tags and links will cause an error because their foreign key is not valid so far
    await this.prisma.project.create({
      data: PrismaProjectMapper.toPrisma(project),
    });
    DomainEvents.dispatchEventsForAggregate(project.id);

    await Promise.all([
      this.prismaProjectLinksRepository.createMany(project.links.getItems()),

      this.prismaProjectTagsRepository.createMany(project.tags.getItems()),
    ]);
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        links: true,
        tags: {
          include: { Tag: true },
        },
      },
    });

    if (!project) {
      return null;
    }

    const mappedProject = PrismaProjectMapper.toDomain(project);

    return mappedProject;
  }

  async findMany({
    amount,
    page = 1,
    query,
  }: ProjectListPaginationParams): Promise<PaginationResponse<Project>> {
    const PER_PAGE = amount ?? 10;

    const offset = (page - 1) * PER_PAGE;

    const where: Prisma.ProjectWhereInput = {};

    if (query) {
      switch (query.type) {
        case 'tag':
          where.tags = { some: { id: query.value } };
          break;
        case 'title':
          where.title = { contains: query.value, mode: 'insensitive' };
          break;
      }
    }

    const projects = await this.prisma.project.findMany({
      take: PER_PAGE,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      where,
      include: {
        links: true,
        tags: {
          include: { Tag: true },
        },
      },
    });

    const projectsTotalCount = await this.prisma.project.count({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const mappedProjects: Project[] = [];

    for (const project of projects) {
      const mappedProject = PrismaProjectMapper.toDomain(project);
      mappedProjects.push(mappedProject);
    }

    return { value: mappedProjects, totalCount: projectsTotalCount };
  }

  async save(project: Project): Promise<void> {
    await Promise.all([
      this.prisma.project.update({
        data: PrismaProjectMapper.toPrisma(project),
        where: {
          id: project.id.toValue(),
        },
      }),

      this.prismaProjectLinksRepository.createMany(project.links.getNewItems()),

      this.prismaProjectLinksRepository.deleteMany(
        project.links.getRemovedItems(),
      ),

      this.prismaProjectTagsRepository.createMany(project.tags.getNewItems()),

      this.prismaProjectTagsRepository.deleteMany(
        project.tags.getRemovedItems(),
      ),
    ]);

    DomainEvents.dispatchEventsForAggregate(project.id);
  }

  async delete(project: Project): Promise<void> {
    await Promise.all([
      this.prisma.project.delete({
        where: {
          id: project.id.toValue(),
        },
      }),

      this.prismaProjectLinksRepository.deleteMany(project.links.getItems()),
      this.prismaProjectTagsRepository.deleteMany(project.tags.getItems()),
    ]);

    DomainEvents.dispatchEventsForAggregate(project.id);
  }
}
