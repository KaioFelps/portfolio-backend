import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { PostFactory } from 'test/factories/post-factory';
import { FetchManyPostsService } from './fetch-many-posts-service';
import { PostTagList } from '../entities/post-tag-list';
import { PostTagFactory } from 'test/factories/post-tag-factory';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

describe('Fetch Many Posts Service', () => {
  let sut: FetchManyPostsService;
  let usersRepository: InMemoryUsersRepository;
  let postsRepository: InMemoryPostsRepository;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    postsRepository = new InMemoryPostsRepository(usersRepository);
    sut = new FetchManyPostsService(postsRepository);
  });

  it('should fetch posts that corresponds to the params', async () => {
    postsRepository.items.push(PostFactory.exec({ title: 'design de fs' }));

    const postToBePushed = PostFactory.exec({ title: 'teste 1' });
    postToBePushed.tags = new PostTagList([
      PostTagFactory.exec({
        value: 'design',
        postId: postToBePushed.id,
      }),
      PostTagFactory.exec({
        value: 'back-end',
        postId: postToBePushed.id,
      }),
    ]);

    postsRepository.items.push(postToBePushed);

    postsRepository.items.push(PostFactory.exec({ title: 'teste 2' }));
    postsRepository.items.push(PostFactory.exec({ title: 'teste 3' }));
    postsRepository.items.push(PostFactory.exec({ title: 'teste 4' }));

    let result = await sut.exec({
      page: 2,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    expect(result.value!.posts.length).toBe(2);

    result = await sut.exec({
      page: 1,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    expect(result.value!.posts.length).toBe(3);

    result = await sut.exec({
      page: 1,
      amount: 3,
      query: 'design',
    });

    expect(result.isOk()).toBe(true);
    expect(result.value!.posts.length).toBe(2);
  });
});
