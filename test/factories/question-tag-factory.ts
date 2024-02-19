import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import {
  ProjectTag,
  ProjectTagProps,
} from '@/domain/projects/entities/project-tag';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectTagFactory {
  static exec(override?: Optional<ProjectTagProps, 'projectId' | 'tagId'>) {
    return ProjectTag.create({
      projectId: new EntityUniqueId(),
      tagId: new EntityUniqueId(),
      ...override,
    });
  }
}
