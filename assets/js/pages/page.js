/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
export default class Page {
  /**
   * @constructor
   * @param {object} app The current app.
   */
  constructor(app) {
    // Store the current app in the page.
    this.a = app;
    // Store the modules in the app.
    this.m = {};
  }

  /**
   * The operation to do before
   * mounting the page.
   * @returns {Promise}
   */
  setUp() {
    return Promise.resolve();
  }

  /**
   * When the page is mounted.
   * @abstract
   */
  mount() {
    throw new TypeError(`${this.toString()}: You must implement the mount method.`);
  }


  /**
   * Before unmounting the page.
   * NEVER CALL DIRECTLY
   *
   * If you want to do some operations before the unmount,
   * Please consider using the clean method instead.
   */
  unmount() {
    // Call the clean operations of
    // specializations first.
    // For turning off the parent app modules.
    this.clean();

    // We should off all our modules.
    Object.keys(this.m).forEach(key => this.m[key].off());
  }

  /**
   * Init the page.
   *
   * At the init stage we
   * should first init all necessary
   * modules.
   */
  init(modules) {
    // Iterate through all modules, execute each module and
    // submit the page (this) via Dependency Injection.
    Object.keys(modules).forEach(key => {
      this.m[key] = modules[key](this);
    });
  }

  /**
   * Clean the app
   *
   * Since each app can be unmounted
   * We should allows a way to clean the memory.
   *
   * Consider using this method if you want to
   * do something specific on ummounting
   * (rather than overriding the unmount method).
   *
   * For turning off the parent app modules.
   */
  clean() {}

  /**
   * Pause the page.
   * When we open the menu,
   * we need to momently pause activities
   * inside the page.
   */
  pause() {
    console.info('This page does not implement pause function');
  }

  /**
   * After pausing a page,
   * We need to resume the page.
   */
  resume() {
    console.info('This page does not implement resume function');
  }
}
