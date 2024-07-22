import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { Tag } from '../entities/tag';
import { TagFactory } from 'test/factories/tag-factory';
import { EditTagService } from './edit-tag-service';

describe('Edit Tag Service', () => {
  let sut: EditTagService;
  let tagsRepository: InMemoryTagsRepository;

  beforeAll(async () => {
    tagsRepository = new InMemoryTagsRepository();
    sut = new EditTagService(tagsRepository);
  });

  it('should create a tag', async () => {
    const tag = TagFactory.exec();
    tagsRepository.items.push(tag);

    const result = await sut.exec({
      value: 'Updated tag',
      tagId: tag.id.toValue(),
    });

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value.tag.value).toBe('Updated tag');
      expect(result.value.tag).toBeInstanceOf(Tag);
    }

    expect(tagsRepository.items[0].value).toBe('Updated tag');
  });
});
