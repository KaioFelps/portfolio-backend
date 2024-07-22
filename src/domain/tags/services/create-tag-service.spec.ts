import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { CreateTagService } from './create-tag-service';
import { Tag } from '../entities/tag';

describe('Create Tag Service', () => {
  let sut: CreateTagService;
  let tagsRepository: InMemoryTagsRepository;

  beforeAll(async () => {
    tagsRepository = new InMemoryTagsRepository();
    sut = new CreateTagService(tagsRepository);
  });

  it('should create a tag', async () => {
    const result = await sut.exec({
      value: 'Foo',
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.tag.value).toBe('Foo');
      expect(result.value.tag).toBeInstanceOf(Tag);
    }

    expect(tagsRepository.items[0].value).toBe('Foo');
  });
});
