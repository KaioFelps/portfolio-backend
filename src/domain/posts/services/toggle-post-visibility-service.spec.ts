import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { TogglePostVisibilityService } from './toggle-post-visibility-service';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/user-factory';
import { PostFactory } from 'test/factories/post-factory';

describe('Change Post Visibility Service', () => {
  let sut: TogglePostVisibilityService;
  let postsRepository: InMemoryPostsRepository;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    postsRepository = new InMemoryPostsRepository(usersRepository);
    sut = new TogglePostVisibilityService(postsRepository, usersRepository);
  });

  test('posts are non-published when created', () => {
    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const post = PostFactory.exec();
    postsRepository.items.push(post);

    expect(post.publishedAt).toBeNull();
  });

  it('should let an editor or an admin toggle a post visibility', async () => {
    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const post = PostFactory.exec();
    postsRepository.items.push(post);

    const result = await sut.exec({
      authorId: user.id.toValue(),
      postId: post.id.toValue(),
    });

    expect(result.isOk()).toBe(true);

    if (result.isOk()) {
      expect(result.value.post.publishedAt).toEqual(expect.any(Date));
    }

    expect(postsRepository.items[0].publishedAt).toEqual(expect.any(Date));
  });

  it('should turn off a published post visibility on toggle', async () => {
    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const post = PostFactory.exec({ publishedAt: new Date() });
    postsRepository.items.push(post);

    const result = await sut.exec({
      authorId: user.id.toValue(),
      postId: post.id.toValue(),
    });

    expect(result.isOk()).toBe(true);

    if (result.isOk()) {
      expect(result.value.post.publishedAt).toBeNull();
    }

    expect(postsRepository.items[0].publishedAt).toBeNull();
  });
});
