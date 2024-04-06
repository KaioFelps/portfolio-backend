import { PaginationParams } from '@/core/types/pagination-params';
import { PaginationResponse } from '@/core/types/pagination-responses';
import { User } from '@/domain/users/entities/user';
import { IUsersRepository } from '@/domain/users/repositories/users-repository';

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.items.find((item) => item.id.toValue() === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((item) => item.email === email) || null;
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
  }

  async save(user: User): Promise<void> {
    const userIndex = this.items.findIndex((item) => item.id.equals(user.id));

    this.items[userIndex] = user;
  }

  async findMany({
    amount: itemsPerPage = 9,
    page = 1,
    query,
  }: PaginationParams): Promise<PaginationResponse<User>> {
    let users: User[] = [];

    if (query) {
      users = this.items.filter((item) => {
        if (item.name.includes(query.trimStart().trimEnd())) {
          return item;
        }

        if (item.email.includes(query.trim())) {
          return item;
        }

        return null;
      });
    } else {
      users = this.items;
    }

    const usersTotalCount = users.length;

    users = users.slice((page - 1) * itemsPerPage, itemsPerPage * page);

    return {
      value: users,
      totalCount: usersTotalCount,
    };
  }

  async delete(user: User): Promise<void> {
    const userIndex = this.items.findIndex((item) => item.id.equals(user.id));
    this.items.splice(userIndex, 1);
  }
}
