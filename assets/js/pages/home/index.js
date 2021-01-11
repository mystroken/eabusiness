/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-assign */
import animate from '@mystroken/g/animate';
import forEachIn from '@mystroken/g/forEachIn';

import Page from '../page';
import * as modules from './modules';
import HeroShapes from './shapes/hero';

export default class HomePage extends Page {
  constructor(app) {
    super(app);

    // Shapes.
    this.s = {
      hero: new HeroShapes({}, this),
    };
  }

  /**
   * Add shapes on the canvas.
   */
  addShapes(canvas) {
    forEachIn(Object.keys(this.s))(key => canvas.prepend(this.s[key]));
  }

  /**
   * Remove shapes from the canvas.
   */
  removeShapes(canvas) {
    forEachIn(Object.keys(this.s))(key => canvas.remove(this.s[key]));
  }

  mount() {
    // Fix the header height
    // on Safari iOS.
    const isSafari = !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (iOS && isSafari) {
      requestAnimationFrame(() => {
        document.querySelector('#hero').style.height = `${window.innerHeight}px`;
      });
    }

    // Init all the necessary modules.
    this.init(modules);

    // Add shapes on the canvas.
    this.addShapes(this.a.m.c2d.c);

    // Turn on the global
    // module C2D.
    this.a.m.c2d.on();

    // Turn on the
    // scroll manager.
    this.m.scroll.on();
    this.m.scroll.onUp = v => {
      this.s.hero.s = v;
    };

    // Turn on the
    // Service Slider.
    this.m.sslider.on();

    // Animate the entrance of the hero elements.
    const HeroSection = document.querySelector('#hero');
    const HeroSectionElements = HeroSection.querySelectorAll('.txt-p-l');
    Array.from(HeroSectionElements).forEach(el => el.style.transform = 'translate3d(0,100%,0)');

    const HeroObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          // Animate elements.
          const d = 1500;
          const delay = i => {
            switch (i) {
              case 2: return 300;
              case 3: return 334;
              default: return i * 200;
            }
          };
          // Initialize shapes on canvas. 0.6727272727
          const update = p => p >= 0.99 && this.s.hero.init();
          animate({
            el: HeroSectionElements,
            d,
            delay,
            e: 'o6',
            p: {
              y: [110, 0],
            },
            update,
          }).play();
          // Stop the hero section observation.
          observer.unobserve(entry.target);
        }
      }
    });
    HeroObserver.observe(HeroSection);
  }

  clean() {
    this.a.m.c2d.off();
    this.removeShapes(this.a.m.c2d.c);
  }

  /**
   * When the menu is displayed.
   */
  pause() {
    this.m.scroll.off();
    this.m.sslider.off();
  }

  /**
   * When the menu is closed.
   */
  resume() {
    this.m.scroll.on();
    this.m.sslider.on();
  }
}
