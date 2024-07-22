import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import {
  ProjectTag,
  ProjectTagProps,
} from '@/domain/projects/entities/project-tag';
import { Injectable } from '@nestjs/common';
import { TagFactory } from './tag-factory';

@Injectable()
export class ProjectTagFactory {
  static exec(
    override?: Optional<ProjectTagProps, 'tag' | 'projectId'>,
    id?: EntityUniqueId,
  ) {
    return ProjectTag.create(
      {
        projectId: new EntityUniqueId(),
        tag: TagFactory.exec(),
        ...override,
      },
      id,
    );
  }
}
