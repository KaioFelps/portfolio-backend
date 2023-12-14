import { Optional } from '@/core/types/optional';
import { User, UserProps, UserRole } from '@/domain/users/entities/user';
import { faker } from '@faker-js/faker';

export class UserFactory {
  static exec(
    role: 'admin' | 'editor',
    override?: Optional<
      UserProps,
      'createdAt' | 'email' | 'name' | 'password' | 'role'
    >,
  ) {
    return User.create({
      email: faker.internet.email(),
      name: faker.person.fullName({ sex: 'male' }),
      password: faker.internet.password(),
      role: UserRole[role],
      createdAt: new Date(),
      ...override,
    });
  }
}
