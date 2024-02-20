import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { PostTag, PostTagProps } from '@/domain/posts/entities/post-tag';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostTagFactory {
  static exec(
    override?: Optional<PostTagProps, 'postId' | 'value'>,
    id?: EntityUniqueId,
  ) {
    return PostTag.create(
      {
        postId: new EntityUniqueId(),
        value: faker.lorem.sentence(),
        ...override,
      },
      id,
    );
  }
}
