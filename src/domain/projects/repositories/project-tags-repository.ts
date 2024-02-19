import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { ProjectTag } from '@/domain/projects/entities/project-tag';

export abstract class IProjectTagsRepository {
  abstract createMany(tags: ProjectTag[]): Promise<void>;
  abstract deleteMany(tags: ProjectTag[]): Promise<void>;
  abstract findManyByProjectId(
    projectId: EntityUniqueId,
  ): Promise<ProjectTag[]>;
}
