import { Either, fail, ok } from '@/core/types/either';
import { Tag } from '../entities/tag';
import { ITagsRepository } from '../repositories/tag-repository';
import { BadRequestError } from '@/core/errors/bad-request-error';
import { Injectable } from '@nestjs/common';

interface EditTagServiceRequest {
  tagId: string;
  value?: string;
}

type EditTagServiceResponse = Either<BadRequestError, { tag: Tag }>;

@Injectable()
export class EditTagService {
  constructor(private tagsRepository: ITagsRepository) {}

  async exec({
    tagId,
    value,
  }: EditTagServiceRequest): Promise<EditTagServiceResponse> {
    const tag = await this.tagsRepository.findById(tagId);

    if (!tag) {
      return fail(new BadRequestError());
    }

    if (!value) return ok({ tag });

    tag.value = value;
    tag.addEditedEventToDispatch();

    await this.tagsRepository.save(tag);

    return ok({ tag });
  }
}
