import { PaginationParams } from '@/core/types/pagination-params';
import { User } from '../entities/user';
import { PaginationResponse } from '@/core/types/pagination-responses';

export abstract class IUsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findMany(
    params: PaginationParams,
  ): Promise<PaginationResponse<User>>;

  abstract save(user: User): Promise<void>;
  abstract delete(user: User): Promise<void>;
}
