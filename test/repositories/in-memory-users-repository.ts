import { User } from '@/domain/users/entities/user';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async findById(id: string): Promise<User> {
    return this.items.find((item) => item.id.toValue() === id);
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async save(user: User): Promise<void> {
    const userIndex = this.items.findIndex((item) => item.id.equals(user.id));

    this.items[userIndex] = user;
  }
}
