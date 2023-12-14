import { EditUserService } from './edit-user-service';
import { UserRole } from '../entities/user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/user-factory';
import { IHashGenerator } from '@/core/crypt/hash-generator';
import { FakeHasher } from 'test/crypt/fake-hasher';

describe('Edit User Service', () => {
  let sut: EditUserService;
  let usersRepository: InMemoryUsersRepository;
  let hasher: IHashGenerator;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    hasher = new FakeHasher();
    sut = new EditUserService(usersRepository, hasher);
  });

  it('should edit a user', async () => {
    const adminUser = UserFactory.exec('admin');
    usersRepository.items.push(adminUser);

    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const result = await sut.exec({
      adminId: adminUser.id.toValue(),
      userId: user.id.toValue(),
      name: 'novo nome',
    });

    expect(result.isOk()).toBe(true);

    // first element is the admin user
    expect(usersRepository.items[1]).toEqual(
      expect.objectContaining({
        name: 'novo nome',
      }),
    );
  });

  it("shouldn't let a non-admin user edit another user", async () => {
    const editorUser = UserFactory.exec('editor');
    usersRepository.items.push(editorUser);

    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const result = await sut.exec({
      adminId: editorUser.id.toValue(),
      userId: user.id.toValue(),
      name: 'fake user',
      password: '123456',
      role: UserRole.admin,
    });

    expect(result.isFail()).toBe(true);
    expect(usersRepository.items[1]).toEqual(
      expect.objectContaining({
        ...user,
      }),
    );
  });
});
