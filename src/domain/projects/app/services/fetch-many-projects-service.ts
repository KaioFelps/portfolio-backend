import { Injectable } from '@nestjs/common';
import { IProjectsRepository } from '../repositories/projects-repository';
import { Either, ok } from '@/core/types/either';
import { PaginationParams } from '@/core/types/pagination-params';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Project } from '../entities/project';

interface FetchManyProjectsServiceRequest extends PaginationParams {}

type FetchManyProjectsServiceResponse = Either<null, { projects: Project[] }>;

@Injectable()
export class FetchManyProjectsService {
  constructor(private projectsRepository: IProjectsRepository) {}

  async exec({
    amount,
    page,
    query,
  }: FetchManyProjectsServiceRequest): Promise<FetchManyProjectsServiceResponse> {
    const projects = await this.projectsRepository.findMany({
      amount: amount ?? QUANTITY_PER_PAGE,
      page: page ?? 1,
      query,
    });

    return ok({
      projects,
    });
  }
}
