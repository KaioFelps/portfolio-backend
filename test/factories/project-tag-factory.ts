import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import {
  ProjectTag,
  ProjectTagProps,
} from '@/domain/projects/entities/project-tag';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectTagFactory {
  static exec(
    override?: Optional<ProjectTagProps, 'projectId' | 'value'>,
    id?: EntityUniqueId,
  ) {
    return ProjectTag.create(
      {
        projectId: new EntityUniqueId(),
        value: faker.lorem.sentence(),
        ...override,
      },
      id,
    );
  }
}
