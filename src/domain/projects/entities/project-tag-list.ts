import { WatchedList } from '@/core/entities/watched-list';
import { ProjectTag } from './project-tag';

export class ProjectTagList extends WatchedList<ProjectTag> {
  compareItems(a: ProjectTag, b: ProjectTag): boolean {
    return a.tag.id.equals(b.tag.id);
  }
}
