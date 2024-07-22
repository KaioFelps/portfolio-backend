import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Project } from '@/domain/projects/entities/project';
import { ProjectLinkList } from '@/domain/projects/entities/project-link-list';
import {
  Prisma,
  Project as PrismaProject,
  Link as PrismaLink,
} from '@prisma/client';
import { PrismaProjectLinkMapper } from './prisma-project-link-mapper';
import { ProjectTagList } from '@/domain/projects/entities/project-tag-list';
import { PrismaProjectTagMapper } from './prisma-project-tag-mapper';
import { PrismaComposedTag } from '../types/composed-tag';

type toDomainParams = PrismaProject & {
  tags: PrismaComposedTag[];
  links: PrismaLink[];
};

export class PrismaProjectMapper {
  static toPrisma(project: Project): Prisma.ProjectUncheckedCreateInput {
    return {
      title: project.title,
      topstory: project.topstory,
      createdAt: project.createdAt,
      id: project.id.toValue(),
    };
  }

  static toDomain({
    createdAt,
    id,
    links,
    tags,
    title,
    topstory,
  }: toDomainParams) {
    return Project.create(
      {
        title,
        topstory,
        createdAt,
        links: new ProjectLinkList(links.map(PrismaProjectLinkMapper.toDomain)),
        tags: new ProjectTagList(tags.map(PrismaProjectTagMapper.toDomain)),
      },
      new EntityUniqueId(id),
    );
  }
}
