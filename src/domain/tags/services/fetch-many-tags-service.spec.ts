import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { TagFactory } from 'test/factories/tag-factory';
import { FetchManyTagsService } from './fetch-many-tags-service';

describe('Fetch Many Tags Service', () => {
  let sut: FetchManyTagsService;
  let tagsRepository: InMemoryTagsRepository;

  beforeAll(async () => {
    tagsRepository = new InMemoryTagsRepository();

    sut = new FetchManyTagsService(tagsRepository);
  });

  beforeAll(async () => {
    const tag1 = TagFactory.exec({ value: 'tag-1' });
    const tag2 = TagFactory.exec({ value: 'tag-2' });
    const tag3 = TagFactory.exec({ value: 'design' });
    const tag4 = TagFactory.exec({ value: 'design de interiores' });
    const tag5 = TagFactory.exec({ value: 'jogos' });
    tagsRepository.items.push(tag1, tag2, tag3, tag4, tag5);
  });

  test('pagination and amount query parameters', async () => {
    const result = await sut.exec({
      page: 2,
      amount: 3,
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) expect(result.value.tags.length).toBe(2);
  });

  test('tag query parameter', async () => {
    const result = await sut.exec({
      page: 1,
      amount: 3,
      query: 'design',
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) expect(result.value.tags.length).toBe(2);
  });
});
