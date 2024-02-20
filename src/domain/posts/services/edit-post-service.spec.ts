import { UserFactory } from 'test/factories/user-factory';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { PostFactory } from 'test/factories/post-factory';
import { EditPostService } from './edit-post-service';
import { InMemoryPostTagsRepository } from 'test/repositories/in-memory-post-tags-repository';

describe('Edit Post Service', () => {
  let sut: EditPostService;
  let postsRepository: InMemoryPostsRepository;
  let usersRepository: InMemoryUsersRepository;
  let postTagsRepository: InMemoryPostTagsRepository;

  beforeEach(async () => {
    postsRepository = new InMemoryPostsRepository();
    usersRepository = new InMemoryUsersRepository();
    postTagsRepository = new InMemoryPostTagsRepository();

    sut = new EditPostService(
      postsRepository,
      usersRepository,
      postTagsRepository,
    );
  });

  it('should edit a post', async () => {
    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const post = PostFactory.exec({ authorId: user.id });
    postsRepository.items.push(post);

    const result = await sut.exec({
      authorId: user.id.toValue(),
      postId: post.id.toValue(),
      title: 'Edited title',
      content: 'Edited content of my previous created post.',
      tags: [{ value: 'nodejs' }],
    });

    expect(result.isOk()).toBe(true);

    expect(postsRepository.items[0]).toMatchObject({
      title: 'Edited title',
      content: 'Edited content of my previous created post.',
    });

    expect(postsRepository.items[0].tags.getItems()).toEqual([
      expect.objectContaining({
        value: 'nodejs',
      }),
    ]);
  });

  it("shouldn't let an user edit a post of other user", async () => {
    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const post = PostFactory.exec();
    postsRepository.items.push(post);

    const result = await sut.exec({
      authorId: user.id.toValue(),
      postId: post.id.toValue(),
      title: 'Edited title',
    });

    expect(result.isFail()).toBe(true);
    expect(result.value).toBeInstanceOf(UnauthorizedError);
  });
});
