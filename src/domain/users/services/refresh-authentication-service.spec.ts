import { UserFactory } from 'test/factories/user-factory';
import { FakeEncryptor } from 'test/crypt/faker-encryptor';
import { RefreshAuthenticationService } from './refresh-authentication-service';

describe('Refresh Authentication Service', () => {
  let sut: RefreshAuthenticationService;
  let encryptor: FakeEncryptor;

  beforeEach(async () => {
    encryptor = new FakeEncryptor();
    sut = new RefreshAuthenticationService(encryptor);
  });

  it('should re-authenticate a user', async () => {
    const user = UserFactory.exec('admin', {
      email: 'kaio@gmail.com',
      name: 'Kaio Felipe',
    });

    const refreshToken = await encryptor.encrypt(
      {
        sub: user.id.toValue(),
        name: user.name,
        role: user.role,
      },
      '10h',
    );

    const result = await sut.exec({ refreshToken });

    expect(result.isOk()).toBe(true);

    if (result.isOk()) {
      expect(result.value.accessToken).toEqual(expect.any(String));
      expect(result.value.refreshToken).toEqual(expect.any(String));
      expect(result.value.user).toMatchObject({
        id: user.id.toValue(),
        name: user.name,
        role: user.role,
      });
    }
  });
});
