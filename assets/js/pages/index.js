import HomePage from './home';
import AboutPage from './about';

export default {
  home: app => new HomePage(app),
  about: app => new AboutPage(app),
};
