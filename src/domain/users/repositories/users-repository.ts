import { User } from '../entities/user';

export abstract class IUsersRepository {
  abstract create(user: User): Promise<void>;
  abstract findById(id: string): Promise<User>;
}
