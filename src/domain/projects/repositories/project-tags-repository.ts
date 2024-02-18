import { ProjectTag } from '@/domain/projects/entities/project-tag';

export abstract class PrismaProjectTagsRepository {
  abstract createMany(tags: ProjectTag[]): Promise<void>;
  abstract deleteMany(tags: ProjectTag[]): Promise<void>;
}
