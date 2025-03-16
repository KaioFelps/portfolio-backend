import { UserFactory } from 'test/factories/user-factory';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { CreatePostService } from './create-post-service';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';

describe('Create Post Service', () => {
  let sut: CreatePostService;
  let tagsRepository: InMemoryTagsRepository;
  let postsRepository: InMemoryPostsRepository;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(async () => {
    tagsRepository = new InMemoryTagsRepository();
    usersRepository = new InMemoryUsersRepository();
    postsRepository = new InMemoryPostsRepository(usersRepository);
    sut = new CreatePostService(
      postsRepository,
      usersRepository,
      tagsRepository,
    );
  });

  it('should create a post', async () => {
    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const result = await sut.exec({
      authorId: user.id,
      title: 'Primeiro post!',
      description: 'Uma preview do conteúdo desse post!',
      content: 'Conteúdo falso para o meu primeiro post!',
      topstory: '',
      tags: ['back-end', 'nodejs'],
    });

    expect(result.isOk()).toBe(true);

    if (result.isOk()) {
      expect(postsRepository.items[0]).toEqual(result.value.post);
      expect(result.value.post.updatedAt).toBeFalsy();
    }
  });

  it("shouldn't create a post without a valid admin or editor id", async () => {
    const result = await sut.exec({
      authorId: new EntityUniqueId('id-falso'),
      title: 'Primeiro post!',
      description: 'Uma preview do conteúdo desse post!',
      content: 'Conteúdo falso para o meu primeiro post!',
      topstory: '',
      tags: ['back-end', 'nodejs'],
    });

    expect(result.isFail()).toBe(true);

    expect(result.value).toBeInstanceOf(UnauthorizedError);
  });
});
