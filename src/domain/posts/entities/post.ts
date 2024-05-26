import { EntityUniqueId } from '@/core/entities/entity-unique-id';
import { Optional } from '@/core/types/optional';
import { Slug } from './value-objects/slug';
import { Aggregate } from '@/core/entities/aggregate';
import { PostCreatedEvent } from '../events/post-created-event';
import { PostEditedEvent } from '../events/post-edited-event';
import { PostTagList } from './post-tag-list';
import { PostDeletedEvent } from '../events/post-deleted-event';

export interface PostProps {
  authorId: EntityUniqueId;
  title: string;
  slug: Slug;
  content: string;
  topstory: string;
  tags: PostTagList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Post extends Aggregate<PostProps> {
  private constructor(props: PostProps, id?: EntityUniqueId) {
    super({ ...props, updatedAt: props.updatedAt ?? null }, id);
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
        tags: props.tags ?? new PostTagList(),
      },
      id,
    );

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

  set tags(value: PostTagList) {
    this.props.tags = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set updatedAt(value: Date | undefined | null) {
    this.props.updatedAt = value;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  public addCreatedEventToDispatch() {
    this.addDomainEvent(new PostCreatedEvent(this));
  }

  public addDeletedEventToDispatch() {
    this.addDomainEvent(new PostDeletedEvent(this));
  }

  public addEditedEventToDispatch() {
    this.addDomainEvent(new PostEditedEvent(this));
  }
}
