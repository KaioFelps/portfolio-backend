import { WatchedList } from '@/core/entities/watched-list';
import { ProjectLink } from './project-link';

export class ProjectLinkList extends WatchedList<ProjectLink> {
  compareItems(a: ProjectLink, b: ProjectLink): boolean {
    return a.id.equals(b.id);
  }
}
