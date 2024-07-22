import { Entity } from '@/core/entities/entity';
import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Tag } from '@/domain/tags/entities/tag';

export interface PostTagProps {
  postId: EntityUniqueId;
  tag: Tag;
}

export class PostTag extends Entity<PostTagProps> {
  private constructor(props: PostTagProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(props: PostTagProps, id?: EntityUniqueId) {
    const postTag = new PostTag({ ...props }, id);
    return postTag;
  }

  get tag() {
    return this.props.tag;
  }

  get postId() {
    return this.props.postId;
  }
}
