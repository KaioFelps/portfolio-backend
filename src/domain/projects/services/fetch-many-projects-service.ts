import { Injectable } from '@nestjs/common';
import {
  IProjectsRepository,
  ProjectQuery,
} from '../repositories/projects-repository';
import { Either, ok } from '@/core/types/either';
import { PaginationParams } from '@/core/types/pagination-params';
import { QUANTITY_PER_PAGE } from '@/core/pagination-consts';
import { Project } from '../entities/project';
import { ITagsRepository } from '@/domain/tags/repositories/tag-repository';

interface FetchManyProjectsServiceRequest
  extends Omit<PaginationParams, 'query'> {
  title?: string;
  tag?: string;
}

type FetchManyProjectsServiceResponse = Either<
  null,
  { projects: Project[]; count: number }
>;

@Injectable()
export class FetchManyProjectsService {
  constructor(
    private projectsRepository: IProjectsRepository,
    private tagsRepository: ITagsRepository,
  ) {}

  async exec({
    amount,
    page,
    title,
    tag,
  }: FetchManyProjectsServiceRequest): Promise<FetchManyProjectsServiceResponse> {
    let query: ProjectQuery | undefined;

    const perfStart = performance.now();

    if (title) {
      query = new ProjectQuery('title', title);
    } else if (tag) {
      const dbTag = await this.tagsRepository.findByValue(tag);

      // return an empty list of projects if tag does not exist, instead of an error
      if (!dbTag)
        return ok({
          projects: [],
          count: 0,
        });

      query = new ProjectQuery('tag', dbTag.id.toValue());
    }

    const { totalCount, value } = await this.projectsRepository.findMany({
      amount: amount ?? QUANTITY_PER_PAGE,
      page: page ?? 1,
      query,
    });

    console.log(
      'Tempo de buscar projetos (Service): ' +
        (performance.now() - perfStart) / 1000 +
        ' segundos',
    );

    return ok({
      projects: value,
      count: totalCount,
    });
  }
}
