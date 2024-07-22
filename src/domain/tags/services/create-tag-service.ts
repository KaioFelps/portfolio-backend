import { Injectable } from '@nestjs/common';
import { ITagsRepository } from '../repositories/tag-repository';
import { Tag } from '../entities/tag';
import { Either, ok } from '@/core/types/either';

interface CreateTagServiceRequest {
  value: string;
}

type CreateTagServiceResponse = Either<null, { tag: Tag }>;

@Injectable()
export class CreateTagService {
  constructor(private tagsRepository: ITagsRepository) {}

  async exec({
    value,
  }: CreateTagServiceRequest): Promise<CreateTagServiceResponse> {
    const tag = Tag.create({
      value,
    });

    await this.tagsRepository.create(tag);

    return ok({
      tag,
    });
  }
}
