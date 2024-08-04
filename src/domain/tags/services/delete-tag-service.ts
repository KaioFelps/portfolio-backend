import { Either, fail, ok } from '@/core/types/either';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { ITagsRepository } from '../repositories/tag-repository';
import { UserRole } from '@/domain/users/entities/user';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { Injectable } from '@nestjs/common';

interface DeleteTagServiceRequest {
  tagId: string;
  userId: string;
}

type DeleteTagServiceResponse = Either<UnauthorizedError, object>;

@Injectable()
export class DeleteTagService {
  constructor(
    private usersRepository: IUsersRepository,
    private tagsRepository: ITagsRepository,
  ) {}

  async exec({
    tagId,
    userId,
  }: DeleteTagServiceRequest): Promise<DeleteTagServiceResponse> {
    const user = await this.usersRepository.findById(userId);
    const tag = await this.tagsRepository.findById(tagId);

    if (!user || user.role !== UserRole.admin)
      return fail(new UnauthorizedError());

    if (!tag) return ok({});

    try {
      await this.tagsRepository.delete(tag.id);
    } finally {
      tag.dispose();
    }

    return ok({});
  }
}
