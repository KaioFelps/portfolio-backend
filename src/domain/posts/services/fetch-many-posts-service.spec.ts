import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { PostFactory } from 'test/factories/post-factory';
import { FetchManyPostsService } from './fetch-many-posts-service';
import { PostTagList } from '../entities/post-tag-list';
import { PostTagFactory } from 'test/factories/post-tag-factory';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { TagFactory } from 'test/factories/tag-factory';

describe('Fetch Many Posts Service', () => {
  let sut: FetchManyPostsService;
  let tagsRepository: InMemoryTagsRepository;
  let usersRepository: InMemoryUsersRepository;
  let postsRepository: InMemoryPostsRepository;

  const tag1 = TagFactory.exec({ value: 'design' });
  const tag2 = TagFactory.exec({ value: 'back-end' });

  beforeAll(async () => {
    tagsRepository = new InMemoryTagsRepository();
    usersRepository = new InMemoryUsersRepository();
    postsRepository = new InMemoryPostsRepository(usersRepository);
    sut = new FetchManyPostsService(postsRepository, tagsRepository);

    postsRepository.items.push(PostFactory.exec({ title: 'design de fs' }));
    tagsRepository.items.push(tag1, tag2);

    const postToBePushed = PostFactory.exec({ title: 'teste 1' });
    postToBePushed.tags = new PostTagList([
      PostTagFactory.exec({
        tag: tag1,
        postId: postToBePushed.id,
      }),
      PostTagFactory.exec({
        tag: tag2,
        postId: postToBePushed.id,
      }),
    ]);

    postsRepository.items.push(postToBePushed);
    postsRepository.items.push(PostFactory.exec({ title: 'teste 2' }));
    postsRepository.items.push(PostFactory.exec({ title: 'teste 3' }));
    postsRepository.items.push(PostFactory.exec({ title: 'teste 4' }));
  });

  test('page and amount parameters', async () => {
    const result = await sut.exec({
      page: 2,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value!.posts.length).toBe(2);
      expect(result.value!.count).toBe(5);
    }
  });

  test('query by title', async () => {
    const result = await sut.exec({
      page: 1,
      amount: 3,
      title: 'design',
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value!.posts.length).toBe(1);
      expect(result.value!.count).toBe(1);
    }
  });

  test('query by tag', async () => {
    const result = await sut.exec({
      page: 1,
      amount: 3,
      tag: 'back-end',
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value!.posts.length).toBe(1);
      expect(result.value!.count).toBe(1);
    }
  });
});
