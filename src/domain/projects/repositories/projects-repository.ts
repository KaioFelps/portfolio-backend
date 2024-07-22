import { PaginationParams } from '@/core/types/pagination-params';
import { Project } from '../entities/project';
import { PaginationResponse } from '@/core/types/pagination-responses';

export class ProjectQuery {
  constructor(
    public type: 'tag' | 'title',
    /** If type is 'tag', the value must be a tag id */
    public value: string,
  ) {}
}

export type ProjectListPaginationParams = Pick<
  PaginationParams,
  Exclude<keyof PaginationParams, 'query'>
> & {
  query?: ProjectQuery;
};

export abstract class IProjectsRepository {
  abstract create(project: Project): Promise<void>;
  abstract findById(id: string): Promise<Project | null>;
  abstract findMany(
    params: ProjectListPaginationParams,
  ): Promise<PaginationResponse<Project>>;

  abstract save(project: Project): Promise<void>;
  abstract delete(project: Project): Promise<void>;
}
