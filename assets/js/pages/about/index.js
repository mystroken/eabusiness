import Page from '../page';
import * as modules from './modules';

export default class AboutPage extends Page {
  mount() {
    // Init all the necessary modules.
    this.init(modules);
  }

  clean() {
  }
}
