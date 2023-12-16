import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { DeleteUserService } from './delete-user-service';
import { UserFactory } from 'test/factories/user-factory';

describe('Delete User Service', () => {
  let sut: DeleteUserService;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new DeleteUserService(usersRepository);
  });

  it('should delete a user if exists', async () => {
    const user = UserFactory.exec('admin');

    const userToBeDeleted = UserFactory.exec('editor');

    usersRepository.items.push(user, userToBeDeleted);

    const result = await sut.exec({
      adminId: user.id.toValue(),
      userId: userToBeDeleted.id.toValue(),
    });

    expect(result.isOk()).toBe(true);
    expect(usersRepository.items.length).toBe(1);
  });

  it("shouldn't delete a admin user", async () => {
    const user = UserFactory.exec('admin');

    const userToBeDeleted = UserFactory.exec('admin');

    usersRepository.items.push(user, userToBeDeleted);

    const result = await sut.exec({
      adminId: user.id.toValue(),
      userId: userToBeDeleted.id.toValue(),
    });

    expect(result.isFail()).toBe(true);
    expect(usersRepository.items.length).toBe(2);
  });

  it("shouldn't let an editor delete any user", async () => {
    const user = UserFactory.exec('editor');

    const userToBeDeleted = UserFactory.exec('editor');

    usersRepository.items.push(user, userToBeDeleted);

    const result = await sut.exec({
      adminId: user.id.toValue(),
      userId: userToBeDeleted.id.toValue(),
    });

    expect(result.isFail()).toBe(true);
    expect(usersRepository.items.length).toBe(2);
  });
});
