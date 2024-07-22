import { Either, fail, ok } from '@/core/types/either';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';
import { ITagsRepository } from '../repositories/tag-repository';
import { UserRole } from '@/domain/users/entities/user';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';

interface DeleteTagServiceRequest {
  tagId: string;
  userId: string;
}

type DeleteTagServiceResponse = Either<UnauthorizedError, object>;

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

    if (!user || user.role !== UserRole.admin)
      return fail(new UnauthorizedError());

    await this.tagsRepository.delete(new EntityUniqueId(tagId));

    return ok({});
  }
}
