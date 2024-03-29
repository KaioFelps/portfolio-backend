import { Project } from '@/domain/projects/entities/project';
import { TagPresenter } from './tag-presenter';
import { ProjectLinkPresenter } from './project-link-presenter';

export class ProjectPresenter {
  static toHTTP(project: Project) {
    return {
      id: project.id.toValue(),
      title: project.title,
      tags: project.tags.getItems().map(TagPresenter.toHTTP),
      links: project.links.getItems().map(ProjectLinkPresenter.toHTTP),
      topstory: project.topstory,
      createdAt: project.createdAt,
    };
  }
}
