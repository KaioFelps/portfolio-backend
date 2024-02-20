import { Entity } from '@/core/entities/entity';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';

export interface PostTagProps {
  postId: EntityUniqueId;
  value: string;
}

export class PostTag extends Entity<PostTagProps> {
  private constructor(props: PostTagProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(props: PostTagProps, id?: EntityUniqueId) {
    const postTag = new PostTag({ ...props }, id);
    return postTag;
  }

  get value() {
    return this.props.value;
  }

  get postId() {
    return this.props.postId;
  }
}
