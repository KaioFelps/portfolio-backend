import { Project } from '../entities/project';

export abstract class IProjectsRepository {
  abstract create(project: Project): Promise<void>;
}
