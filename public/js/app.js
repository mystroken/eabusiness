(function () {
  'use strict';

  // Import a module (eg modals) and export it directly.
  // Only serves to bundle all the modules under one file.
  // This makes it easy to rebuild through all modules.
  // export { default as c2d } from './canvas';
  // export { default as cursor } from './cursor';
  // export { default as gl } from './gl';
  // export { default as loader } from './loader';
  // export { default as menu } from './menu';

  var modules = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  /* eslint-disable no-console */
  /* eslint-disable class-methods-use-this */
  class Page {
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

  // Import a module (eg modals) and export it directly.
  // Only serves to bundle all the modules under one file.
  // This makes it easy to rebuild through all modules.
  // export { default as scroll } from './scroll';
  // export { default as sslider } from './sslider';

  var modules$1 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  /* eslint-disable no-restricted-syntax */

  class HomePage extends Page {


    mount() {

      // Init all the necessary modules.
      this.init(modules$1);
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

  // Import a module (eg modals) and export it directly.
  // Only serves to bundle all the modules under one file.
  // This makes it easy to rebuild through all modules.
  // export { default as explorer } from './explorer';

  var modules$2 = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  class AboutPage extends Page {
    mount() {
      // Init all the necessary modules.
      this.init(modules$2);
    }

    clean() {
    }
  }

  var Pages = {
    home: app => new HomePage(app),
    about: app => new AboutPage(app),
    contact: app => new AboutPage(app),
  };

  // Load all modules from the folder and save them in the variable


  class App {
    constructor() {
      // Store global modules
      // in the app.
      this.m = {};

      // Store the current page.
      this.p = null;

      // Store informations about the current device.
      this.d = null;
    }

    init() {

      // Iterate through all modules, execute each module and
      // submit the app (this) via Dependency Injection.
      Object.keys(modules).forEach(key => {
        this.m[key] = modules[key](this);
      });

      // Get the current page.
      this.p = this.getCurrentPage(document.querySelector('#page'));
    }

    /**
     * Runs the application.
     */
    run() {
      // Initialize the app and its modules.
      this.init();

      // Turn on modules
      // const { cursor } = this.m;

      // Now we can mount the current page.
      if (this.p) {
        this.p
          .setUp()
          .finally(() => {
            this.p.mount();
          });
      }

      // Barba js
      // const app = this;
      // let transitionLock = false;
      // const Transition = Barba.BaseTransition.extend({
      //   start() {
      //     // transitionLock = true;
      //     // loader
      //     //   .show()
      //     //   .then(() => {
      //     //     app.p.unmount();
      //     //     transitionLock = false;
      //     //   });

      //     this.newContainerLoading.then(this.finish.bind(this));
      //   },

      //   finish() {
      //     if (transitionLock) {
      //       requestAnimationFrame(this.finish.bind(this));
      //     } else {
      //       // Remove the old container.
      //       this.done();
      //       // Get the current page
      //       // Set it up
      //       // Hide the loader and mount the page.
      //       app.p = app.getCurrentPage(this.newContainer);
      //       app.p
      //         .setUp()
      //         .finally(() => {
      //           // loader.hide();
      //           app.p.mount();
      //         });
      //     }
      //   },
      // });
      // Barba.Pjax.Dom.wrapperId = 'main';
      // Barba.Pjax.Dom.containerClass = 'page';
      // Barba.Pjax.getTransition = () => Transition;
      // Barba.Pjax.start();
    }

    getCurrentPage(page) {
      const key = page.getAttribute('data-key');

      // eslint-disable-next-line no-prototype-builtins
      if (Pages.hasOwnProperty(key)) {
        /*eslint-disable-line */
        return Pages[key](this);
      }

      throw new TypeError('This page is not registered.');
    }
  }

  // We only have one app, so we can instantly create an instance.
  const app = new App();
  app.run();

  // optionally: save the app in Window,
  // so that we can easily access it from the Browser Console for debugging purposes.
  window.app = app;

}());
