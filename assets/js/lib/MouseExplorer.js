/* eslint-disable no-underscore-dangle */

import bindAll from '@mystroken/g/bindAll';
import lerp from '@mystroken/g/lerp';
import Raf from '@mystroken/g/Raf';
import forEachIn from '@mystroken/g/forEachIn';
import clamp from '@mystroken/g/clamp';
import round from '@mystroken/g/round';

export default class MouseExplorer {

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

    // The easing.
    this.e = o.ease || 0.21;

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

    this.v = {
      // Does the lib is initialized.
      initialized: false,
      // Listeners to notify.
      listeners: [],
      // The number of listeners.
      numListeners: 0,
      // Center at the start.
      center: (typeof o.center !== 'undefined') ? o.center : false,
    };

    // RequestAnimationFrame
    // interface.
    this.r = new Raf(this._run);


    this._resize();
  }


  on(f) {
    if (!this.v.initialized) this.init();
    this.v.listeners.push(f);
    this.v.numListeners = this.v.listeners.length;
  }


  off(f) {
    this.v.listeners.splice(f, 1);
    this.v.numListeners = this.v.listeners.length;
    if (this.v.numListeners <= 0) this.destroy();
  }


  /**
   * Turn on the library.
   */
  init() {
    // At the beginning, place
    // the page on center.
    if (this.v.center) {
      this.m.x.t = (this.c.w - this.W) / 2;
      this.m.y.t = (this.c.h - this.H) / 2;
    }

    this.m.x.c = this.m.x.t;
    this.m.y.c = this.m.y.t;

    // Then run the loop
    // And bind events.
    this.r.run();
    this._addEvents();

    this.v.initialized = true;
  }

  /**
   *
   * @param {{x: Number, y: Number}} coords
   * @returns {{x: Number, y: Number}}
   * @private
   */
  _convertCoordsToPixels(coords) {
    let X = coords.x || 0;
    let Y = coords.y || 0;

    // Clamp.
    X = clamp(X, -1, 1);
    Y = clamp(Y, -1, 1);

    // Convert coords to pixel.
    const x = (1 + X) * ((this.c.w - this.W) / 2);
    const y = (1 + Y) * ((this.c.h - this.H) / 2);

    return { x, y };
  }

  /**
   * @param {{x: Number, y: Number}} coords
   */
  setPosition(coords) {
    const position = this._convertCoordsToPixels(coords);
    this.m.x.t = (position.x) ? position.x : 0;
    this.m.y.t = (position.y) ? position.y : 0;
  }

  /**
   *
   * @returns {{x: number, y: number}}
   */
  getPosition(coords) {
    if (typeof coords.x !== 'undefined' || typeof coords.y !== 'undefined') {
      return this._convertCoordsToPixels(coords);
    }
    return { x: this.m.x.c, y: this.m.x.c };
  }


  /**
   * Turn off the library.
   */
  destroy() {
    this.v.initialized = false;
    this.r.stop();
    this._rmEvents();
  }


  _run() {
    this.m.ticking = true;

    // Compute.
    this.m.x.c = round(lerp(this.m.x.c, this.m.x.t, this.e), 3);
    this.m.y.c = round(lerp(this.m.y.c, this.m.y.t, this.e), 3);

    // If the current value is equal to the last one,
    // This means that we don't need anymore to run the loop.
    if (this.m.x.c === this.m.x.l && this.m.y.c === this.m.y.l) {
      this.r.stop();
      this.m.ticking = false;
    }

    // Notify listeners.
    forEachIn(this.v.listeners)(f => {
      f({ x: this.m.x.c, y: this.m.y.c });
    });

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
