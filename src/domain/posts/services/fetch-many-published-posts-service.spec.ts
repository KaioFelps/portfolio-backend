import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { PostFactory } from 'test/factories/post-factory';
import { FetchManyPublishedPostsService } from './fetch-many-published-posts-service';
import { PostTagList } from '../entities/post-tag-list';
import { PostTagFactory } from 'test/factories/post-tag-factory';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { TagFactory } from 'test/factories/tag-factory';

describe('Fetch Many Posts Service', () => {
  let sut: FetchManyPublishedPostsService;
  let tagsRepository: InMemoryTagsRepository;
  let usersRepository: InMemoryUsersRepository;
  let postsRepository: InMemoryPostsRepository;

  beforeEach(async () => {
    tagsRepository = new InMemoryTagsRepository();
    usersRepository = new InMemoryUsersRepository();
    postsRepository = new InMemoryPostsRepository(usersRepository);
    sut = new FetchManyPublishedPostsService(postsRepository, tagsRepository);
  });

  it('should only fetch published posts', async () => {
    postsRepository.items.push(PostFactory.exec());
    postsRepository.items.push(PostFactory.exec({ publishedAt: new Date() }));

    const result = await sut.exec({});

    expect(result.isOk()).toBe(true);
    if (result.isOk()) expect(result.value?.posts).toHaveLength(1);
  });

  it('should fetch posts that corresponds to the params', async () => {
    const tag1 = TagFactory.exec({ value: 'design' });
    tagsRepository.items.push(tag1);

    const postToBePushed = PostFactory.exec({
      title: 'teste 1',
      publishedAt: new Date(),
    });
    postToBePushed.tags = new PostTagList([
      PostTagFactory.exec({
        tag: tag1,
        postId: postToBePushed.id,
      }),
    ]);

    postsRepository.items.push(
      postToBePushed,
      PostFactory.exec({ title: 'design de fs', publishedAt: new Date() }),
      PostFactory.exec({ title: 'teste 3', publishedAt: new Date() }),
      PostFactory.exec({ title: 'teste 4', publishedAt: new Date() }),
    );

    let result = await sut.exec({
      page: 2,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value!.posts.length).toBe(1);
      expect(result.value!.count).toBe(4);
    }

    result = await sut.exec({
      page: 1,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value!.posts.length).toBe(3);
      expect(result.value!.count).toBe(4);
    }

    result = await sut.exec({
      page: 1,
      amount: 3,
      tag: 'design',
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value!.posts.length).toBe(1);
      expect(result.value!.count).toBe(1);
    }
  });
});
