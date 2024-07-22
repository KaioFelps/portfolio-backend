import { Project } from '@/domain/projects/entities/project';
import { ProjectAndPostTagPresenter } from './project-and-post-tag-presenter';
import { ProjectLinkPresenter } from './project-link-presenter';

export class ProjectPresenter {
  static toHTTP(project: Project) {
    return {
      id: project.id.toValue(),
      title: project.title,
      tags: project.tags.getItems().map(ProjectAndPostTagPresenter.toHTTP),
      links: project.links.getItems().map(ProjectLinkPresenter.toHTTP),
      topstory: project.topstory,
      createdAt: project.createdAt,
    };
  }
}
