import { PaginationParams } from '@/core/types/pagination-params';
import { User } from '../entities/user';

export abstract class IUsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findById(id: string): Promise<User>;
  abstract findMany(params: PaginationParams): Promise<User[]>;
  abstract save(user: User): Promise<void>;
  abstract delete(user: User): Promise<void>;
}
