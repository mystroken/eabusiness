/**
 * The Application core.
 * @author Mystro Ken <mystroken@gmail.com>
 */

// Load all modules from the folder and save them in the variable
// import Barba from 'barba.js';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap';
import * as modules from './modules';
import Pages from './pages';

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

    // Listen scroll and hide or show header.
    const header = document.getElementById('header');
    const { height } = header.getBoundingClientRect();
    const watchHeader = () => {
      let last = 0;
      let current = 0;
      let ticking = false;
      const onScroll = scroll => {
        // if (scroll < last) {
        //   header.classList.remove('pull-up');
        // } else {
        //   header.classList.add('pull-up');
        // }

        if (scroll <= height) {
          header.classList.remove('dark');
        } else {
          header.classList.add('dark');
        }
      };
      window.addEventListener('scroll', () => {
        current = window.scrollY;
        if (!ticking) {
          window.requestAnimationFrame(() => {
            onScroll(current);
            ticking = false;
            last = (current >= 0) ? current : 0;
          });
        }
        ticking = true;
      });
    };

    watchHeader();

    // Collapse
    $('.collapse').collapse();

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
