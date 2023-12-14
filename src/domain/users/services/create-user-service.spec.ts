import { CreateUserService } from './create-user-service';
import { UserRole } from '../entities/user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/user-factory';

describe('Create User Service', () => {
  let sut: CreateUserService;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateUserService(usersRepository);
  });

  it('should create a user', async () => {
    const adminUser = UserFactory.exec('admin');

    usersRepository.items.push(adminUser);

    const result = await sut.exec({
      adminId: adminUser.id.toValue(),
      email: 'testemail@gmail.com',
      name: 'fake user',
      password: '123456',
      role: UserRole.admin,
    });

    expect(result.isOk()).toBe(true);

    // first element is the admin user
    expect(usersRepository.items[1]).toEqual(
      expect.objectContaining({
        name: 'fake user',
      }),
    );
  });

  it("shouldn't let a non-admin user create another user", async () => {
    const editorUser = UserFactory.exec('editor');

    usersRepository.items.push(editorUser);

    const result = await sut.exec({
      adminId: editorUser.id.toValue(),
      email: 'testemail@gmail.com',
      name: 'fake user',
      password: '123456',
      role: UserRole.admin,
    });

    expect(result.isFail()).toBe(true);
    expect(usersRepository.items.length).toBe(1); // only editor user on the items list
  });
});
