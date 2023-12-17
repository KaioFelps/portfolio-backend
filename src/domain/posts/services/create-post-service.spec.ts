import { UserFactory } from 'test/factories/user-factory';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { CreatePostService } from './create-post-service';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

describe('Create Post Service', () => {
  let sut: CreatePostService;
  let postsRepository: InMemoryPostsRepository;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(async () => {
    postsRepository = new InMemoryPostsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new CreatePostService(postsRepository, usersRepository);
  });

  it('should create a post', async () => {
    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const result = await sut.exec({
      authorId: user.id.toValue(),
      title: 'Primeiro post!',
      content: 'Conteúdo falso para o meu primeiro post!',
      topstory: '',
      tags: ['back-end', 'nodejs'],
    });

    expect(result.isOk()).toBe(true);

    if (result.isOk()) {
      expect(postsRepository.items[0]).toEqual(result.value.post);
    }
  });

  it("shouldn't create a post without a valid admin or editor id", async () => {
    const result = await sut.exec({
      authorId: 'id-falso',
      title: 'Primeiro post!',
      content: 'Conteúdo falso para o meu primeiro post!',
      topstory: '',
      tags: ['back-end', 'nodejs'],
    });

    expect(result.isFail()).toBe(true);

    expect(result.value).toBeInstanceOf(UnauthorizedError);
  });
});
