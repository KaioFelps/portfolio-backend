import { PaginationParams } from '@/core/types/pagination-params';
import { Project } from '../entities/project';

export abstract class IProjectsRepository {
  abstract create(project: Project): Promise<void>;
  abstract findById(id: string): Promise<Project>;
  abstract findMany(params: PaginationParams): Promise<Project[]>;
  abstract save(project: Project): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
