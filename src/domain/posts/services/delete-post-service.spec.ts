import { UserFactory } from 'test/factories/user-factory';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { PostFactory } from 'test/factories/post-factory';
import { DeletePostService } from './delete-post-service';

describe('Delete Post Service', () => {
  let sut: DeletePostService;
  let postsRepository: InMemoryPostsRepository;
  let usersRepository: InMemoryUsersRepository;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    postsRepository = new InMemoryPostsRepository(usersRepository);
    sut = new DeletePostService(postsRepository, usersRepository);
  });

  it("should let an user delete it's post", async () => {
    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const post = PostFactory.exec({ authorId: user.id });
    postsRepository.items.push(post);

    const result = await sut.exec({
      postId: post.id.toValue(),
      authorId: user.id.toValue(),
    });

    expect(result.isOk()).toBe(true);

    expect(postsRepository.items.length).toBe(0);
  });

  it("shouldn't let an user delete a post of other user", async () => {
    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const post = PostFactory.exec();
    postsRepository.items.push(post);

    const result = await sut.exec({
      authorId: user.id.toValue(),
      postId: post.id.toValue(),
    });

    expect(result.isFail()).toBe(true);

    expect(result.value).toBeInstanceOf(UnauthorizedError);
  });

  it("shouldn't let an admin delete any post", async () => {
    const editor = UserFactory.exec('editor');
    const admin = UserFactory.exec('admin');
    usersRepository.items.push(editor, admin);

    const post = PostFactory.exec({ authorId: editor.id });
    postsRepository.items.push(post);

    const result = await sut.exec({
      authorId: admin.id.toValue(),
      postId: post.id.toValue(),
    });

    expect(result.isOk()).toBe(true);

    expect(postsRepository.items.length).toBe(0);
  });
});
