import { User } from '@/domain/users/entities/user';

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toValue(),
      name: user.name,
      email: user.email,
      role: user.role.toString(),
      createdAt: user.createdAt,
    };
  }
}
