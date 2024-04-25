import { WatchedList } from '@/core/entities/watched-list';
import { PostTag } from './post-tag';

export class PostTagList extends WatchedList<PostTag> {
  compareItems(a: PostTag, b: PostTag): boolean {
    return a.value === b.value;
  }
}
