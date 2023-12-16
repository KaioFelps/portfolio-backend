import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/user-factory';
import { FetchManyUsersService } from './fetch-many-users-service';

describe('Fetch Many Users Service', () => {
  let sut: FetchManyUsersService;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    sut = new FetchManyUsersService(usersRepository);
  });

  it('should fetch users that corresponds to the params', async () => {
    usersRepository.items.push(...generateSixFakeUsers());

    let result = await sut.exec({
      page: 2,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    expect(result.value.users.length).toBe(3);

    result = await sut.exec({
      page: 1,
      amount: 4,
    });

    expect(result.isOk()).toBe(true);
    expect(result.value.users.length).toBe(4);

    result = await sut.exec({
      page: 1,
      amount: 3,
      query: 'Pessoa',
    });

    expect(result.isOk()).toBe(true);
    expect(result.value.users.length).toBe(2);
  });
});

function generateSixFakeUsers() {
  return [
    UserFactory.exec('admin', { name: 'Joao Pessoa', email: 'uvds@g.com' }),
    UserFactory.exec('editor', { name: 'Maria Vitória', email: 'vdsv@g.com' }),
    UserFactory.exec('admin', { name: 'Ana Maria', email: 'bdbsd@g.com' }),
    UserFactory.exec('admin', { name: 'Felipe Pessoa', email: 'vsbsf@g.com' }),
    UserFactory.exec('editor', { name: 'Jussara Tanaka', email: 'pbo@g.com' }),
    UserFactory.exec('editor', { name: 'Maria Clara', email: 'klbjls@g.com' }),
  ];
}
