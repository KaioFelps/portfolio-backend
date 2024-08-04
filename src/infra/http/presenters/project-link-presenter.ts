import { ProjectLink } from '@/domain/projects/entities/project-link';

export type ProjectLinkPresented = {
  title: string;
  value: string;
};

export class ProjectLinkPresenter {
  static toHTTP(link: ProjectLink) {
    return {
      title: link.title,
      value: link.value,
    } satisfies ProjectLinkPresented;
  }
}
