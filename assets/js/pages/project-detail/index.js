import Page from '../page';
import * as modules from './modules';

export default class ProjectDetailsPage extends Page {
  mount() {
    // Init all the necessary modules.
    this.init(modules);

    // Turn on the global
    // module C2D.
    this.a.m.c2d.on();
  }

  clean() {
    this.a.m.c2d.off();
  }
}
