/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-assign */

import Page from '../page';
import * as modules from './modules';

export default class ExpertisePage extends Page {


  mount() {

    // Init all the necessary modules.
    this.init(modules);
  }

  clean() {
  }

  /**
   * When the menu is displayed.
   */
  pause() {
  }

  /**
   * When the menu is closed.
   */
  resume() {
  }
}
