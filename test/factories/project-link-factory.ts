import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import {
  ProjectLink,
  ProjectLinkProps,
} from '@/domain/projects/entities/project-link';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectLinkFactory {
  static exec(
    override?: Optional<ProjectLinkProps, 'projectId' | 'value' | 'title'>,
  ) {
    return ProjectLink.create({
      projectId: new EntityUniqueId(),
      value: faker.internet.url(),
      title: faker.company.name(),
      ...override,
    });
  }
}
