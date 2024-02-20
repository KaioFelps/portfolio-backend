import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { Post, PostProps } from '@/domain/posts/entities/post';
import { PostTagList } from '@/domain/posts/entities/post-tag-list';
import { faker } from '@faker-js/faker';

export class PostFactory {
  static exec(
    override?: Optional<
      PostProps,
      | 'createdAt'
      | 'content'
      | 'slug'
      | 'tags'
      | 'title'
      | 'topstory'
      | 'updatedAt'
      | 'authorId'
    >,
  ) {
    return Post.create({
      tags: new PostTagList([]),
      title: faker.lorem.lines(1),
      topstory: faker.image.url(),
      authorId: new EntityUniqueId(faker.string.uuid()),
      content: faker.lorem.paragraphs(),
      createdAt: new Date(),
      ...override,
    });
  }
}
