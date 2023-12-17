import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { Post, PostProps } from '@/domain/posts/entities/post';
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
      tags: faker.word.words(3).split(' '),
      title: faker.lorem.lines(1),
      topstory: faker.image.url(),
      authorId: new EntityUniqueId(faker.string.uuid()),
      content: faker.lorem.paragraphs(),
      createdAt: new Date(),
      ...override,
    });
  }
}
