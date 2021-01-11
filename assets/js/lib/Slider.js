/* eslint-disable no-underscore-dangle */

import bindAll from '@mystroken/g/bindAll';
import Drag from '@mystroken/drag';
import Raf from '@mystroken/g/Raf';

export default class Slider {
  constructor(o) {
    bindAll(this, ['_calc', '_run']);

    // Get the content container.
    // The container is used to listen the
    // hold and drag event.
    this.c = o.container || window;

    // The wheel to rotate.
    this.w = o.wheel;

    // Project items and their container.
    this.p = Array.from(o.projects);
    this.pC = this.p[0].parentNode;

    // Init the slider variables.
    this.v = {};

    // Where to store drag variables.
    this.d = {
      // The current value.
      c: 0,
      // The target value.
      t: 0,
      // The last value.
      l: 0,
      // Ticking.
      ticking: false,
    };

    // Initialize the Drag library
    this.D = new Drag({
      listener: o.container,
    });

    // RequestAnimationFrame
    // interface.
    this.r = new Raf(this._run);
  }

  /**
   * Turn on the modules
   */
  on() {
    // this.r.run();
    this._attachEvents();
    this._drawWheel();
  }

  /**
   * Turn off the module.
   */
  off() {
    this.r.stop();
    this._removeEvents();
  }

  _calc(e) {
    this.d.t += e.X;

    if (this.d.ticking === false) this.r.run();
  }

  _run() {
    this.d.ticking = true;
    this.d.c += (this.d.t - this.d.c) * 0.1;
    this.d.c = Number(this.d.c.toFixed(3));

    // If the current value is equal to the last one,
    // This means that we don't need anymore to run the loop.
    if (this.d.c === this.d.l) {
      this.r.stop();
      this.d.ticking = false;
    }

    // Rotate the wheel.
    this.w.style.transform = `rotate3d(0,0,1,${this.d.c}deg)`;

    // Slide the images
    this.pC.style.transform = `translate3d(${this.d.c}px,0,0)`;

    // Keep track of the last value.
    this.d.l = this.d.c;
  }

  _onMouseDown() {}

  _onMouseUp() {}

  _attachEvents() {
    this.D.on(this._calc);
  }

  _removeEvents() {
    this.D.off(this._calc);
  }

  _drawWheel() {

    const svgWheel = this.w;

    // For each service, create a
    // svg text element.
    const svgWheelFragment = document.createDocumentFragment();
    Array
      .from(document.querySelectorAll('.s-slider-wheel-v__item'))
      .forEach(vertex => {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.appendChild(document.createTextNode(vertex.innerText));
        svgWheelFragment.appendChild(textElement);
      });
    svgWheel.appendChild(svgWheelFragment);

    // Select all the texts
    // we've recently created.
    const svgTexts = Array.from(svgWheel.querySelectorAll('text'));

    // Since we have all our texts.
    // We can now calculate the circumference of our wheel.
    //
    // By the way, we'll need to align texts one
    // after the other.
    const fsize = window.getComputedStyle(svgWheel, null).getPropertyValue('font-size');
    const gutter = parseFloat(fsize) * 0.8;
    const circumference = svgTexts
      .reduce((acc, cur) => {
        const { width } = cur.getBBox();
        cur.setAttributeNS(null, 'dx', acc);
        cur.setAttributeNS(null, 'dy', -1 * gutter);
        return acc + width + gutter;
      }, 0);

    // With the circumference, now
    // we can set the correct svg dimension
    const diameter = circumference / Math.PI;
    const size = diameter + 40 + (gutter * 2);
    svgWheel.setAttribute('width', size);
    svgWheel.setAttribute('height', size);


    // Then we can draw the wheel.
    const textPath = svgWheel.querySelector('#s-slider-wheel-curve');
    const R = diameter / 2;
    const CX = size / 2;
    const CY = CX;
    textPath.setAttributeNS(
      null,
      'd',
      `M ${CX - R}, ${CY} a ${R},${R} 0 1,1 ${R * 2},0 a ${R},${R} 0 1,1 -${R * 2},0`
    );

    // And at the end, we are able to
    // place each text on the path.
    svgTexts
      .forEach(textEl => {
        const textNode = textEl.removeChild(textEl.firstChild);
        const textPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');

        textPathElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#s-slider-wheel-curve');
        textPathElement.appendChild(textNode);

        textEl.appendChild(textPathElement);
      });
  }
}
