import { ProjectLink } from '../entities/project-link';

export abstract class IProjectLinksRepository {
  abstract createMany(links: ProjectLink[]): Promise<void>;
  abstract deleteMany(links: ProjectLink[]): Promise<void>;
}
