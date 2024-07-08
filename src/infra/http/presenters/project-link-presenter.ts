import { ProjectLink } from '@/domain/projects/entities/project-link';

export class ProjectLinkPresenter {
  static toHTTP(link: ProjectLink) {
    return {
      title: link.title,
      value: link.value,
    };
  }
}
