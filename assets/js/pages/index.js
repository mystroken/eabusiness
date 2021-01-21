import HomePage from './home';
import AboutPage from './about';
import ExpertisePage from './expertise';

export default {
  home: app => new HomePage(app),
  about: app => new AboutPage(app),
  expertise: app => new ExpertisePage(app),
  contact: app => new AboutPage(app),
};
