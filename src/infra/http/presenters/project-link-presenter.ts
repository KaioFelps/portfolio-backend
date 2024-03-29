import { ProjectLink } from '@/domain/projects/entities/project-link';

export class ProjectLinkPresenter {
  static toHTTP(link: ProjectLink) {
    return {
      id: link.id.toValue(),
      value: link.value,
    };
  }
}
