import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { PostFactory } from 'test/factories/post-factory';
import { FetchManyPostsService } from './fetch-many-posts-service';

describe('Fetch Many Posts Service', () => {
  let sut: FetchManyPostsService;
  let postsRepository: InMemoryPostsRepository;

  beforeEach(async () => {
    postsRepository = new InMemoryPostsRepository();
    sut = new FetchManyPostsService(postsRepository);
  });

  it('should fetch posts that corresponds to the params', async () => {
    postsRepository.items.push(
      PostFactory.exec({ tags: [], title: 'design de fs' }),
    );
    postsRepository.items.push(
      PostFactory.exec({ tags: ['design', 'back-end'], title: 'teste 1' }),
    );
    postsRepository.items.push(
      PostFactory.exec({ tags: [], title: 'teste 2' }),
    );
    postsRepository.items.push(
      PostFactory.exec({ tags: [], title: 'teste 3' }),
    );
    postsRepository.items.push(
      PostFactory.exec({ tags: [], title: 'teste 4' }),
    );

    let result = await sut.exec({
      page: 2,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    expect(result.value.posts.length).toBe(2);

    result = await sut.exec({
      page: 1,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    expect(result.value.posts.length).toBe(3);

    result = await sut.exec({
      page: 1,
      amount: 3,
      query: 'design',
    });

    expect(result.isOk()).toBe(true);
    expect(result.value.posts.length).toBe(2);
  });
});
