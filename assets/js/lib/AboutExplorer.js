/* eslint-disable no-underscore-dangle */

import bindAll from '@mystroken/g/bindAll';
import lerp from '@mystroken/g/lerp';
import Raf from '@mystroken/g/Raf';
import clamp from '@mystroken/g/clamp';
import round from '@mystroken/g/round';

export default class AboutExplorer {

  constructor(o) {
    bindAll(this, ['_calc', '_run', '_resize']);

    // Get the content container.
    // The container is used to get the size.
    this.c = {
      // The DOM element.
      el: o.container,
      // The container width.
      w: 0,
      // The container height.
      h: 0,
    };

    // Mouse Movement.
    this.m = {
      ticking: false,
      x: {
        // The current value.
        c: 0,
        // The target value.
        t: 0,
        // The last value.
        l: 0,
      },
      y: {
        // The current value.
        c: 0,
        // The target value.
        t: 0,
        // The last value.
        l: 0,
      },
    };

    // Viewport Width.
    this.W = 0;

    // Viewport Height.
    this.H = 0;

    // RequestAnimationFrame
    // interface.
    this.r = new Raf(this._run);

    // Call resize to positionate
    // elements.
    this._resize();
  }


  /**
   * Turn on the library.
   */
  on() {
    // At the begining, place
    // the page on center.
    this.m.x.t = this.c.w / (this.c.w / this.W);
    this.m.x.c = this.c.w / (this.c.w / this.W);
    this.m.y.t = this.c.h / (this.c.h / this.H);
    this.m.y.c = this.c.h / (this.c.h / this.H);

    // Then run the loop
    // And bind events.
    this.r.run();
    this._addEvents();
  }


  /**
   * Turn off the library.
   */
  off() {
    this.r.stop();
    this._rmEvents();
  }


  _run() {
    this.m.ticking = true;

    // Compute.
    this.m.x.c = round(lerp(this.m.x.c, this.m.x.t, 0.21), 3);
    this.m.y.c = round(lerp(this.m.y.c, this.m.y.t, 0.21), 3);

    // If the current value is equal to the last one,
    // This means that we don't need anymore to run the loop.
    if (this.m.x.c === this.m.x.l && this.m.y.c === this.m.y.l) {
      this.r.stop();
      this.m.ticking = false;
    }

    // Displace the container.
    this.c.el.style.transform = `translate3d(${-1 * this.m.x.c}px,${-1 * this.m.y.c}px,0)`;

    // Keep track of the last value.
    this.m.x.l = this.m.x.c;
    this.m.y.l = this.m.y.c;
  }


  _calc(e) {
    this.m.x.t = e.pageX * ((this.c.w / this.W) - 1);
    this.m.y.t = e.pageY * ((this.c.h / this.H) - 1);

    this._clamp();

    if (this.m.ticking === false) this.r.run();
  }


  _clamp() {
    this.m.x.t = clamp(this.m.x.t, 0, (this.c.w - this.W));
    this.m.y.t = clamp(this.m.y.t, 0, (this.c.h - this.H));
  }


  _resize() {
    const b = this.c.el.getBoundingClientRect();
    this.W = window.innerWidth;
    this.H = window.innerHeight;

    this.c.w = b.width;
    this.c.h = b.height;

    this._clamp();
  }


  _addEvents() {
    window.addEventListener('resize', this._resize);
    window.addEventListener('mousemove', this._calc);
  }


  _rmEvents() {
    window.removeEventListener('mousemove', this._calc);
    window.removeEventListener('resize', this._resize);
  }


}
