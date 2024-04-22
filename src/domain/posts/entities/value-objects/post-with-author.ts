import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { PostTagList } from '../post-tag-list';
import { Slug } from './slug';
import { ValueObject } from '@/core/entities/value-objects';

export interface PostWithAuthorProps {
  id: EntityUniqueId;
  author: string;
  title: string;
  slug: Slug;
  content: string;
  topstory: string;
  tags: PostTagList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class PostWithAuthor extends ValueObject<PostWithAuthorProps> {
  private constructor(props: PostWithAuthorProps) {
    super(props);
  }

  static create(props: PostWithAuthorProps) {
    return new PostWithAuthor(props);
  }

  get id() {
    return this.props.id;
  }

  get author() {
    return this.props.author;
  }

  get title() {
    return this.props.title;
  }

  get slug() {
    return this.props.slug;
  }

  get content() {
    return this.props.content;
  }

  get topstory() {
    return this.props.topstory;
  }

  get tags() {
    return this.props.tags;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
