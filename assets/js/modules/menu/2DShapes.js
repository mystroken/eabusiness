/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import bindAll from '@mystroken/g/bindAll';
import Renderable from '@mystroken/canvas/Renderable';

export default class Menu2DShapes extends Renderable {
  constructor(p) {
    super(p);
    bindAll(this, ['resize']);

    // Variables.
    this.v = {
      // viewport dimensions.
      W: 0,
      H: 0,
    };

    // Animations variables.
    this.a = {
      // Circle shape variables.
      c: {
        o: 1, // Opacity.
        d: 0, // to 1 the circle is complete.
      },
    };

    this.circleContainer = document.querySelector('#m-s-g-circle');

    // Setting up stuffs.
    this.resize();
    this.addEvents();
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c a canvas context.
   */
  render(c) {
    if (this.a.c.d <= 0) return;
    this.drawCircle(c);
  }

  /**
   * Render the circle.
   * @param {CanvasRenderingContext2D} c
   */
  drawCircle(c) {
    const {
      width,
      left,
      top,
    } = this.circleContainer.getBoundingClientRect();
    const radius = width / 2;

    c.globalAlpha = this.a.c.o;
    c.beginPath();
    c.arc(left + radius, top + radius, radius, 0, (2 * this.a.c.d) * Math.PI, false);
    c.lineWidth = 1;
    c.strokeStyle = '#707070';
    c.stroke();
    c.globalAlpha = 1;
  }

  addEvents() {
    window.addEventListener('resize', this.resize);
  }

  resize() {
    this.v.W = window.innerWidth;
    this.v.H = window.innerHeight;

    // Position.
    this.p.x = (this.v.W / 2);
    this.p.y = (this.v.H / 2);
  }
}
