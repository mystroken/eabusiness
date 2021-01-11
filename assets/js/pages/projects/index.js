import bindAll from '@mystroken/g/bindAll';
import Page from '../page';
import * as modules from './modules';

export default class ProjectsPage extends Page {
  constructor(app) {
    super(app);
    bindAll(this, ['menuOpenerClickHandler']);
  }

  menuOpenerClickHandler(e) {
    e.preventDefault();
    this.a.m.menu.open();
    return false;
  }

  setUp() {
    return new Promise(
      // Some modules may need
      // a certain delay to get ready
      // before mounting the page.
      resolve => {
        // Init all the modules.
        this.init(modules);
        // The slider module needs
        // to be set up before turned on.
        this.m.slider.setUp().finally(resolve);
      },
    );
  }

  mount() {
    // Turn on the global
    // module C2D.
    this.a.m.c2d.on();

    // Turn on the
    // project slider.
    this.m.slider.on();

    // Menu opener
    document.querySelector('#pp-menu-opener')
      .addEventListener('click', this.menuOpenerClickHandler);
  }

  /**
   * Manually off modules from app.
   */
  clean() {
    this.a.m.c2d.off();

    // Menu opener
    document.querySelector('#pp-menu-opener')
      .removeEventListener('click', this.menuOpenerClickHandler);
  }

  /**
   * Pause the page.
   * When we open the menu,
   * we need to momently pause activities
   * inside the page.
   */
  pause() {
    // Pause the
    // project slider.
    this.m.slider.pause();
  }

  /**
   * After pausing a page,
   * We need to resume the page.
   */
  resume() {
    // Resume the
    // project slider.
    this.m.slider.resume();
  }
}
