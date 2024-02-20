import { PaginationParams } from '@/core/types/pagination-params';
import { Project } from '@/domain/projects/entities/project';
import { IProjectsRepository } from '@/domain/projects/repositories/projects-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { PrismaProjectMapper } from '../mappers/prisma-project-mapper';
import { DomainEvents } from '@/core/events/domain-events';
import { IProjectLinksRepository } from '@/domain/projects/repositories/project-links-repository';
import { IProjectTagsRepository } from '@/domain/projects/repositories/project-tags-repository';

@Injectable()
export class PrismaProjectsRepository implements IProjectsRepository {
  constructor(
    private prisma: PrismaService,
    private prismaProjectTagsRepository: IProjectTagsRepository,
    private prismaProjectLinksRepository: IProjectLinksRepository,
  ) {}

  async create(project: Project): Promise<void> {
    await Promise.all([
      this.prisma.project.create({
        data: PrismaProjectMapper.toPrisma(project),
      }),

      this.prismaProjectLinksRepository.createMany(project.links.getItems()),

      this.prismaProjectTagsRepository.createMany(project.tags.getItems()),
    ]);

    DomainEvents.dispatchEventsForAggregate(project.id);
  }

  async findById(id: string): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        links: true,
        tags: true,
      },
    });

    const mappedProject = PrismaProjectMapper.toDomain(project);

    return mappedProject;
  }

  async findMany({
    amount,
    page,
    query,
  }: PaginationParams): Promise<Project[]> {
    const PER_PAGE = amount ?? 10;

    const offset = (page - 1) * PER_PAGE;

    const projects = await this.prisma.project.findMany({
      take: PER_PAGE,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
      where: { title: { contains: query } },
      include: {
        links: true,
        tags: true,
      },
    });

    const mappedProjects = [];

    for (const project of projects) {
      mappedProjects.push(PrismaProjectMapper.toDomain(project));
    }

    return mappedProjects;
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
  }
}
