import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { Slug } from './value-objects/slug';
import { Aggregate } from '@/core/entities/aggregate';
import { PostCreatedEvent } from '../events/post-created-event';
import { PostEditedEvent } from '../events/post-edited-event';

export interface PostProps {
  authorId: EntityUniqueId;
  title: string;
  slug: Slug;
  content: string;
  topstory: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Post extends Aggregate<PostProps> {
  private constructor(props: PostProps, id?: EntityUniqueId) {
    super(props, id);
  }

  static create(
    props: Optional<PostProps, 'createdAt' | 'slug'>,
    id?: EntityUniqueId,
  ) {
    const post = new Post(
      {
        ...props,
        slug: props.slug ?? Slug.fromTitle(props.title),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const postIsNew = !id;

    if (postIsNew) {
      post.addDomainEvent(new PostCreatedEvent(post));
    }

    return post;
  }

  get authorId() {
    return this.props.authorId;
  }

  get title() {
    return this.props.title;
  }

  set title(value: string) {
    this.props.title = value;
    this.props.slug = Slug.fromTitle(value);
    this.touch();
  }

  get slug() {
    return this.props.slug.value;
  }

  get content() {
    return this.props.content;
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  get topstory() {
    return this.props.topstory;
  }

  set topstory(value: string) {
    this.props.topstory = value;
    this.touch();
  }

  get tags() {
    return this.props.tags;
  }

  set tags(value: string[]) {
    this.props.tags = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();

    this.addDomainEvent(new PostEditedEvent(this));
  }
}
