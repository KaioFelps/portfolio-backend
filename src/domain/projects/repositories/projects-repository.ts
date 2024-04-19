import { PaginationParams } from '@/core/types/pagination-params';
import { Project } from '../entities/project';
import { PaginationResponse } from '@/core/types/pagination-responses';

export abstract class IProjectsRepository {
  abstract create(project: Project): Promise<void>;
  abstract findById(id: string): Promise<Project | null>;
  abstract findMany(
    params: PaginationParams,
  ): Promise<PaginationResponse<Project>>;

  abstract save(project: Project): Promise<void>;
  abstract delete(project: Project): Promise<void>;
}
