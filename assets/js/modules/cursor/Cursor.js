// eslint-disable-next-line max-classes-per-file
import clamp from '@mystroken/g/clamp';
import animate from '@mystroken/g/animate';
import lerp from '@mystroken/g/lerp';
import Renderable from '@mystroken/canvas/Renderable';
import bindAll from '@mystroken/g/bindAll';
import throttle from '@mystroken/g/throttle';

export default class Cursor extends Renderable {
  constructor(p) {
    super(p);
    bindAll(this, ['onMove', 'onMouseDown', 'onMouseUp', 'onHover']);

    // The cursor position.
    this.p = {
      x: {
        l: null, // Last value.
        c: 0, // Current value.
        t: 0, // Target value.
      },
      y: {
        l: null, // last value.
        c: 0, // Current value.
        t: 0, // Target value.
      },
      // Velocity
      speed: {
        t: 0, // Ticking
        x: 0, // Value on X.
        y: 0, // Value on Y.
        m: 20, // Max value
      },
    };

    // The cursor size.
    this.s = {
      v: 42,
      s: 0,
    };

    this.radius = 21;
    // this.color = '#707070';
    this.color = '#ca2d18';
    this.drawn = {
      value: 1,
    };

    this.setup();

    // Variables.
    this.v = {
      initialized: false,
    };

    this.frame = {
      radius: this.radius,
      color: this.color,
      // Deformation.
      d: {
        a: 0, // Rotation angle.
        v: 0, // Deformation value.
      },
    };

    // Hovering variables.
    this.h = {
      l: null, // last hovered links.
      t: throttle(el => this.checkCursorState(el), 100, false, true, this), // Throttle function.
    };

    const animationParams = { el: this.s, d: 1000, e: 'o6' };
    this.onHoverLinkAnimation = animate({ ...animationParams, p: { s: 0.6 } });
    this.onLeaveLinkAnimation = animate({ ...animationParams, p: { s: 1 } });
    this.onMouseUpAnimation = animate({ ...animationParams, p: { s: 1 } });
    this.onMouseDownAnimation = animate({ ...animationParams, p: { s: 0.5 } });
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c a canvas context.
   */
  render(c) {
    if (this.v.initialized === false) return;

    // Compute variables.
    this.p.x.c = lerp(this.p.x.c, this.p.x.t, 0.2);
    this.p.y.c = lerp(this.p.y.c, this.p.y.t, 0.2);

    // Compute the cursor transformation.
    this.radius = this.s.s * (this.s.v / 2);

    // Draw elements.
    this.drawFrame(c);
    this.drawKernel(c);
  }

  /**
   * Draw the Cursor Frame .
   *
   * @param {*} c
   */
  drawFrame(c) {
    c.save();

    // Compute frame deformation.
    const amplitude = 1 + (this.frame.d.v / this.p.speed.m);
    // const dpr = window.devicePixelRatio || 1;
    const X = this.p.x.c;
    const Y = this.p.y.c;

    c.translate(X, Y);
    c.rotate(this.frame.d.a);
    c.scale(amplitude, 1);

    c.beginPath();
    c.arc(0, 0, this.radius, 0, (2 * this.drawn.value) * Math.PI, false);
    c.lineWidth = 0.3;
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();

    c.restore();
  }

  /**
   * Draw the cursor Kernel.
   *
   * @param {*} c
   */
  drawKernel(c) {
    c.beginPath();
    c.arc(this.p.x.t, this.p.y.t, this.radius / 3, Math.PI * 2, false);
    c.closePath();
    c.fillStyle = '#ca2d18';
    c.fill();
  }

  setup() {
    this.addEvents();
  }

  init() {
    animate({
      el: this.s,
      d: 1000,
      e: 'o6',
      p: { s: 1 },
    }).play();

    this.v.initialized = true;
  }

  checkLinkHovering(el) {
    this.h.l = null;

    // eslint-disable-next-line no-param-reassign
    while (el && !el.href) el = el.parentNode;

    if (el) {
      this.h.l = el;
      this.onHoverLinkAnimation.play();
    } else {
      this.onLeaveLinkAnimation.play();
      this.h.l = null;
    }
  }

  checkCursorState(el) {
    // Check the hover state.
    if (this.s.s > 1) {
      this.checkLinkHovering(el);
    }
  }

  onMove(e) {
    this.p.x.t = e.pageX;
    this.p.y.t = e.pageY;
    this.p.x.c = (!this.v.initialized) ? e.pageX : this.p.x.c;
    this.p.y.c = (!this.v.initialized) ? e.pageY : this.p.y.c;

    const clear = () => {
      this.p.x.l = null;
      this.p.y.l = null;
      this.p.speed.x = 0;
      this.p.speed.y = 0;
      this.frame.d.a = 0;
      this.frame.d.v = 0;
    };

    if (this.p.x.l != null) this.p.speed.x = this.p.x.t - this.p.x.l;
    if (this.p.y.l != null) this.p.speed.y = this.p.y.t - this.p.y.l;
    if (this.p.x.l != null && this.p.y.l != null) {
      // Get the movement angle (Radian).
      this.frame.d.a = Math.atan2(this.p.speed.y, this.p.speed.x);
      // Clamp the velocity value.
      this.p.speed.x = clamp(Math.abs(this.p.speed.x), 0, this.p.speed.m);
      this.p.speed.y = clamp(Math.abs(this.p.speed.y), 0, this.p.speed.m);
      // Compute the deformation amount.
      this.frame.d.v = Math.sqrt((this.p.speed.y ** 2) + (this.p.speed.x ** 2));
    }

    this.p.x.l = this.p.x.t;
    this.p.y.l = this.p.y.t;
    // eslint-disable-next-line no-unused-expressions
    this.p.speed.t && clearTimeout(this.p.speed.t);
    this.p.speed.t = setTimeout(clear, 30);

    this.h.t(e.target);

    if (this.v.initialized === false) this.init();
  }

  onMouseDown() {
    this.onMouseDownAnimation.play();
  }

  onMouseUp() {
    this.onMouseUpAnimation.play();
  }

  onHover(e) {
    this.checkLinkHovering(e.target);
  }

  addEvents() {
    window.addEventListener('mousemove', this.onMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    document.body.addEventListener('mouseover', this.onHover);
  }
}
