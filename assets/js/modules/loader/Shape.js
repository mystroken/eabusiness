import bindAll from '@mystroken/g/bindAll';
import animate from '@mystroken/g/animate';
import Renderable from '@mystroken/canvas/Renderable';

export default class LoaderShape extends Renderable {
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
      // Background shape variables.
      Y: 0,
    };

    // Setting up stuffs.
    this.resize();
    this.addEvents();
  }

  render(c, W, H) {
    this.drawBackground(c, W, H);
  }

  /**
   * Render the background.
   * @param {CanvasRenderingContext2D} c
   */
  drawBackground(c, W, H) {
    // c.fillStyle = '#ca2d18';
    c.fillStyle = '#ca2d18';
    c.fillRect(0, this.a.Y, W, H);
  }

  /**
   * Make shapes appear on the screen.
   */
  draw() {
    return new Promise(resolve => {
      animate({
        el: this.a,
        e: 'o6',
        d: 1200,
        cb: () => resolve(),
        p: {
          Y: [this.v.H, 0],
        },
      }).play();
    });
  }

  /**
   * Make shapes dissapear from the screen.
   */
  undraw() {
    return new Promise(resolve => {
      animate({
        el: this.a,
        e: 'o6',
        d: 1200,
        cb: () => resolve(),
        p: {
          Y: [0, this.v.H],
        },
      }).play();
    });
  }

  addEvents() {
    window.addEventListener('resize', this.resize);
  }

  resize() {
    this.v.W = window.innerWidth;
    this.v.H = window.innerHeight;
    if (this.a.Y !== 0) this.a.Y = this.v.H;
  }
}
