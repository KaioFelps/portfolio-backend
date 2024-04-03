import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { Project, ProjectProps } from '@/domain/projects/entities/project';
import { ProjectLinkList } from '@/domain/projects/entities/project-link-list';
import { ProjectTagList } from '@/domain/projects/entities/project-tag-link';
import { PrismaProjectMapper } from '@/infra/db/prisma/mappers/prisma-project-mapper';
import { PrismaService } from '@/infra/db/prisma/prisma-service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectFactory {
  constructor(private prisma: PrismaService) {}

  static exec(
    override?: Optional<
      ProjectProps,
      'createdAt' | 'links' | 'tags' | 'title' | 'topstory'
    >,
    id?: EntityUniqueId,
  ) {
    return Project.create(
      {
        links: new ProjectLinkList(),
        tags: new ProjectTagList(),
        title: faker.lorem.lines(1),
        topstory: '',
        createdAt: new Date(),
        ...override,
      },
      id,
    );
  }

  async createAndPersist(
    override?: Optional<
      ProjectProps,
      'createdAt' | 'links' | 'tags' | 'title' | 'topstory'
    >,
  ) {
    const project = ProjectFactory.exec(override);
    const prismaUser = PrismaProjectMapper.toPrisma(project);

    await this.prisma.project.create({ data: prismaUser });

    return project;
  }
}
