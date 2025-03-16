import { UserFactory } from 'test/factories/user-factory';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory-posts-repository';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { PostFactory } from 'test/factories/post-factory';
import { EditPostService } from './edit-post-service';
import { InMemoryPostTagsRepository } from 'test/repositories/in-memory-post-tags-repository';
import { InMemoryTagsRepository } from 'test/repositories/in-memory-tags-repository';
import { TagFactory } from 'test/factories/tag-factory';
import { PostTagList } from '../entities/post-tag-list';
import { PostTag } from '../entities/post-tag';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';

describe('Edit Post Service', () => {
  let sut: EditPostService;
  let tagsRepository: InMemoryTagsRepository;
  let postsRepository: InMemoryPostsRepository;
  let usersRepository: InMemoryUsersRepository;
  let postTagsRepository: InMemoryPostTagsRepository;

  beforeEach(async () => {
    tagsRepository = new InMemoryTagsRepository();
    usersRepository = new InMemoryUsersRepository();
    postsRepository = new InMemoryPostsRepository(usersRepository);
    postTagsRepository = new InMemoryPostTagsRepository();

    sut = new EditPostService(
      tagsRepository,
      postsRepository,
      usersRepository,
      postTagsRepository,
    );
  });

  it('should edit a post', async () => {
    const user = UserFactory.exec('editor');
    usersRepository.items.push(user);

    const initialTag = TagFactory.exec({ value: 'rust' });
    tagsRepository.items.push(initialTag);

    const postId = new EntityUniqueId();
    const post = PostFactory.exec(
      {
        authorId: user.id,
        tags: new PostTagList([PostTag.create({ postId, tag: initialTag })]),
      },
      postId,
    );

    postsRepository.items.push(post);

    const tag = TagFactory.exec({ value: 'nodejs' });
    tagsRepository.items.push(tag);

    const result = await sut.exec({
      authorId: user.id.toValue(),
      postId: post.id.toValue(),
      title: 'Edited title',
      description: 'Edited preview of the post.',
      content: 'Edited content of my previous created post.',
      tags: [tag.id.toValue()],
    });

    expect(result.isOk()).toBe(true);

    expect(postsRepository.items[0]).toMatchObject({
      title: 'Edited title',
      description: 'Edited preview of the post.',
      content: 'Edited content of my previous created post.',
    });

    expect(postsRepository.items[0].tags.getItems()[0].tag.id.toValue()).toBe(
      tag.id.toValue(),
    );

    expect(result.isOk());
    if (result.isOk()) {
      expect(result.value.post.tags.getItems()[0].tag).toEqual(tag);
      expect(result.value.post.tags.getItems().length).toBe(1);
    }
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
