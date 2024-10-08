import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { Project, ProjectProps } from '@/domain/projects/entities/project';
import { ProjectLinkList } from '@/domain/projects/entities/project-link-list';
import { ProjectTagList } from '@/domain/projects/entities/project-tag-list';
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
    const project = Project.create(
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

    if (!id) project.addCreatedEventToDispatch();

    return project;
  }

  async createAndPersist(
    override?: Optional<
      ProjectProps,
      'createdAt' | 'links' | 'tags' | 'title' | 'topstory'
    >,
    id?: EntityUniqueId,
  ) {
    const project = ProjectFactory.exec(override, id);
    const prismaUser = PrismaProjectMapper.toPrisma(project);

    await this.prisma.project.create({ data: prismaUser });

    return project;
  }
}
