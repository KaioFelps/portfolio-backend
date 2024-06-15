import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { PostFactory } from 'test/factories/post-factory';
import { GetPostBySlugService } from './get-post-by-slug-service';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserFactory } from 'test/factories/user-factory';
import { TokenPayload } from '@/infra/auth/jwt-strategy';

describe('Get Post By Slug Service', () => {
  let sut: GetPostBySlugService;
  let usersRepository: InMemoryUsersRepository;
  let postsRepository: InMemoryPostsRepository;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    postsRepository = new InMemoryPostsRepository(usersRepository);
    sut = new GetPostBySlugService(postsRepository);
  });

  it('should only let either editors or admins to see unpublished posts', async () => {
    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const post = PostFactory.exec({ authorId: user.id });

    postsRepository.items.push(post);

    const result = await sut.exec({ slug: post.slug, user: null });
    const staffResult = await sut.exec({
      slug: post.slug,
      user: {
        name: user.name,
        role: user.role,
        sub: user.id.toValue(),
      } satisfies TokenPayload,
    });

    assert(!result.value!.post);
    assert(!!staffResult.value!.post);
  });

  it('should get a published post by slug', async () => {
    const user = UserFactory.exec('admin');
    usersRepository.items.push(user);

    const post = PostFactory.exec({
      title: 'design de fs',
      authorId: user.id,
      publishedAt: new Date(),
    });

    postsRepository.items.push(post);

    const result = await sut.exec({
      slug: post.slug,
      user: null,
    });

    expect(result.isOk()).toBe(true);

    if (result.isOk()) {
      expect(result.value!.post?.title).toEqual(post.title);
      expect(result.value!.post?.id.toValue()).toEqual(post.id.toValue());
      expect(result.value!.post?.author).toEqual(user.name);
    }
  });
});
