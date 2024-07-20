import { AuthenticateService } from './authenticate-service';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/user-factory';
import { FakeHasher } from 'test/crypt/fake-hasher';
import { FakeEncryptor } from 'test/crypt/faker-encryptor';

describe('Authenticate Service', () => {
  let sut: AuthenticateService;
  let usersRepository: InMemoryUsersRepository;
  let comparorAndHasher: FakeHasher;
  let encryptor: FakeEncryptor;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    comparorAndHasher = new FakeHasher();
    encryptor = new FakeEncryptor();
    sut = new AuthenticateService(
      usersRepository,
      comparorAndHasher,
      encryptor,
    );
  });

  it('should authenticate a user', async () => {
    const user = UserFactory.exec('admin', {
      email: 'kaio@gmail.com',
      password: await comparorAndHasher.generate('123'),
      name: 'Kaio Felipe',
    });

    usersRepository.items.push(user);

    const result = await sut.exec({
      email: 'kaio@gmail.com',
      password: '123',
    });

    expect(result.isOk()).toBe(true);

    if (result.isOk()) {
      expect(result.value.accessToken).toEqual(expect.any(String));
      expect(result.value.user).toMatchObject({
        id: user.id.toValue(),
        name: user.name,
        role: user.role,
      });
    }
  });
});
