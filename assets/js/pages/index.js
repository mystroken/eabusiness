import HomePage from './home';
import AboutPage from './about';
import ProjectsPage from './projects';
import ProjectDetailsPage from './project-detail';

export default {
  home: app => new HomePage(app),
  about: app => new AboutPage(app),
  projects: app => new ProjectsPage(app),
  'project-detail': app => new ProjectDetailsPage(app),
};
