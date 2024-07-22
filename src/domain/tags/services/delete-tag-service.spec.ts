import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { TagFactory } from 'test/factories/tag-factory';
import { DeleteTagService } from './delete-tag-service';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/user-factory';

describe('Delete Tag Service', () => {
  let sut: DeleteTagService;
  let tagsRepository: InMemoryTagsRepository;
  let usersRepository: InMemoryUsersRepository;

  beforeAll(async () => {
    tagsRepository = new InMemoryTagsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new DeleteTagService(usersRepository, tagsRepository);
  });

  it('should delete a tag', async () => {
    const tag = TagFactory.exec({ value: 'Foo' });
    tagsRepository.items.push(tag);

    const user = UserFactory.exec('admin');
    usersRepository.items.push(user);

    const result = await sut.exec({
      tagId: tag.id.toValue(),
      userId: user.id.toValue(),
    });

    expect(result.isOk()).toBe(true);
    expect(tagsRepository.items.length).toBe(0);
  });

  it('should not let a non-admin user delete a tag', async () => {
    const tag = TagFactory.exec({ value: 'Foo' });
    tagsRepository.items.push(tag);

    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const result = await sut.exec({
      tagId: tag.id.toValue(),
      userId: user.id.toValue(),
    });

    expect(result.isFail()).toBe(true);
    expect(tagsRepository.items.length).toBe(1);
  });
});
