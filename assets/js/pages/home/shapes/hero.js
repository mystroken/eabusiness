import Renderable from '@mystroken/canvas/Renderable';
import animate from '@mystroken/g/animate';
import bindAll from '@mystroken/g/bindAll';
import { rotateX, rotateY } from '../../../helpers';

export default class HeroShapes extends Renderable {
  constructor(p, page) {
    super(p);
    bindAll(this, ['resize']);

    // Get the app.
    this._p = page;

    // radius.
    this.r = 0;

    // color.
    this.c = '#707070';

    // scroll amount.
    this.s = 0;

    // viewport dimensions.
    this.W = 0;
    this.H = 0;

    // Variables.
    this.v = {
      // Is the renderable is initialized.
      initialized: false,
    };

    // Animations variables.
    this.a = {
    // LEFT CIRCLES.
      // Stroke First.
      lsf: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
      // Stroke Second
      lss: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
      // Ball First.
      lbf: {
        r: 45, // Rotation Angle.
        t: 0, // Transparency.
      },
      // Ball Second.
      lbs: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
      // Ball Third.
      lbt: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
      lf1: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },

    // CENTER CIRCLES.
      // Stroke first.
      csf: {
        r: 0, // Rotation
        t: 0, // Transparency.
      },
      // Stroke second.
      css: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
      // Stroke third.
      cst: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
      // Ball first.
      cbf: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
      // Ball second.
      cbs: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
      // Ball third.
      cbt: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },

    // RIGHT CIRCLES.
      // Stroke first.
      rsf: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
      // Stroke second.
      rss: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
      // Ball first.
      rbf: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
      // Ball second.
      rbs: {
        r: 0, // Rotation Angle.
        t: 0, // Transparency.
      },
    };

    this.resize();
    this.addEvents();
  }

  /**
   * Init the shapes on the canvas.
   *
   * This method will be called externally to
   * trigger the entry animation.
   */
  init() {
    if (!this.v.initialized) {
      this.v.initialized = true;

      const r = { d: 1500, e: 'io4' };
      const t = { d: 700, e: 'io2', p: { t: [0, 1] } };

      const animateOtherCircles = () => {
        animate({ ...t, el: this.a.csf }).play();

        // Left circles.
        animate({ ...t, el: this.a.lsf }).play();
        animate({ ...t, el: this.a.lss }).play();
        animate({ ...t, el: this.a.lbf, delay: 100 }).play();
        animate({ ...t, el: this.a.lbs }).play();
        animate({ ...r, d: 1000, el: this.a.lbs, p: { r: [110, 20] } }).play();
        animate({ ...t, el: this.a.lbt }).play();
        animate({ ...r, d: 1000, el: this.a.lbt, p: { r: [165, 75] } }).play();

        // Right circles.
        animate({ ...t, el: this.a.rsf }).play();
        animate({ ...t, el: this.a.rss }).play();
        animate({ ...t, el: this.a.rbf }).play();
        animate({ ...r, d: 1000, el: this.a.rbf, p: { r: [250, 160] } }).play();
        animate({ ...t, el: this.a.rbs }).play();
        animate({ ...r, d: 1000, el: this.a.rbs, p: { r: [210, 120] } }).play();
      };

      let otherCirclesDisplayed = false;
      const displayOtherCirclesOnTime = progress => {
        if (!otherCirclesDisplayed && progress >= 0.03) {
          animateOtherCircles();
          otherCirclesDisplayed = true;
        }
      };

      // Center circles.
      animate({ ...t, el: this.a.css }).play();
      animate({ ...t, el: this.a.cst }).play();

      animate({ ...t, el: this.a.cbf }).play();
      animate({ ...r, el: this.a.cbf, p: { r: [70, -20] } }).play();
      animate({ ...t, el: this.a.cbs }).play();
      animate({ ...r, el: this.a.cbs, p: { r: [45, 135] } }).play();
      animate({ ...t, el: this.a.cbt }).play();
      animate({ ...r, el: this.a.cbt, p: { r: [135, 225] }, update: displayOtherCirclesOnTime }).play();
    }
  }

  /**
   *
   * @param {*} c
   */
  render(c) {
    // Do not render anythinhg until
    // they have been initialized.
    if (!this.v.initialized) return;

    // Move horizontally the shape on scroll.
    const p = this.getPosition();

    // Then draw the shape elements.
    this.drawCircleSM(c, p);
    this.drawCircleMed(c, p);
    this.drawCircleBig(c, p);
    this.drawCornerLeftCircles(c, p);
    this.drawCornerRightCircles(c, p);
  }

  getPosition() {
    return {
      x: this.p.x,
      y: this.p.y - this.s,
    };
  }

  addEvents() {
    window.addEventListener('resize', this.resize);
  }

  resize() {
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    const t = document.querySelector('#hero h1');

    // Compute size.
    const b = t.getBoundingClientRect();
    this.r = (b.width / 2) + 38;

    // Positionate.
    this.p.x = (this.W / 2);
    this.p.y = (this.H / 2);
  }

  computeRotation(accumulator, ease = 0.2) {
    const acceleration = this._p.m.scroll ? this._p.m.scroll.a : 0;
    return ((accumulator + (acceleration / 10)) - accumulator) * ease;
  }

  /**
   * Draw the big interrupted circle stroke.
   */
  drawCircleBig(c, p) {
    const r = this.r * 2;
    this.a.csf.r += 0.1;
    this.a.csf.r += this.computeRotation(this.a.csf.r);
    this.a.csf.r = this.a.csf.r >= 360 ? 0 : this.a.csf.r;

    const radStart = this.a.csf.r * (Math.PI/180);
    const radEnd = radStart + (2 * Math.PI);
    c.globalAlpha = this.a.csf.t;
    c.beginPath();
    c.setLineDash([10, 10]);
    c.arc(p.x, p.y, r, radStart, radEnd, false);
    c.lineWidth = 1;
    c.strokeStyle = this.c;
    c.stroke();
    c.globalAlpha = 1;
    c.setLineDash([]);
  }

  drawCircleMed(c, p) {
    const r = this.r * 1.4;

    // Draw the stroke.
    c.globalAlpha = this.a.css.t;
    c.beginPath();
    c.arc(p.x, p.y, r, 2 * Math.PI, false);
    c.lineWidth = 1;
    c.strokeStyle = this.c;
    c.stroke();
    c.globalAlpha = 1;

    // Draw the first ball.
    this.a.cbf.r -= this.computeRotation(this.a.cbf.r);
    const x2 = rotateX(p.x, r, this.a.cbf.r);
    const y2 = rotateY(p.y, r, this.a.cbf.r);

    const r2 = r * 0.05;
    c.globalAlpha = this.a.cbf.t;
    c.beginPath();
    c.arc(x2, y2, r2, 2 * Math.PI, false);
    c.fillStyle = this.c;
    c.fill();
    c.globalAlpha = 1;
  }

  drawCircleSM(c, p) {
    const { r } = this;

    // Draw the stroke.
    c.globalAlpha = this.a.cst.t;
    c.beginPath();
    c.arc(p.x, p.y, r, 2 * Math.PI, false);
    c.lineWidth = 1;
    c.strokeStyle = this.c;
    c.stroke();
    c.globalAlpha = 1;

    // Draw the first ball (big).
    const r2 = r * 0.19;
    this.a.cbs.r -= this.computeRotation(this.a.cbs.r)
    const x2 = rotateX(p.x, r, this.a.cbs.r);
    const y2 = rotateY(p.y, r, this.a.cbs.r);
    c.globalAlpha = this.a.cbs.t;
    c.beginPath();
    c.arc(x2, y2, r2, 2 * Math.PI, false);
    c.fillStyle = this.c;
    c.fill();
    c.globalAlpha = 1;

    // Draw the second ball (small).
    const r3 = r * 0.05;
    this.a.cbt.r += this.computeRotation(this.a.cbt.r);
    const x3 = rotateX(p.x, r, this.a.cbt.r);
    const y3 = rotateY(p.y, r, this.a.cbt.r);
    c.globalAlpha = this.a.cbt.t;
    c.beginPath();
    c.arc(x3, y3, r3, 2 * Math.PI, false);
    c.fillStyle = this.c;
    c.fill();
    c.globalAlpha = 1;
  }

  drawCornerLeftCircles(c, p) {
    // Do not draw corner circles, if the
    // viewport width is not 1200px at least.
    if (this.W < 1200) return;

    const { r } = this;

    // Draw first stroke
    const x = 0;
    const y = p.y - this.H / 2;
    c.globalAlpha = this.a.lss.t;
    c.beginPath();
    c.arc(x, y, r, 2 * Math.PI, false);
    c.lineWidth = 1;
    c.strokeStyle = this.c;
    c.stroke();
    c.globalAlpha = 1;
    // Draw first stroke elem #1
    const r2 = r * 0.19;
    this.a.lbs.r += this.computeRotation(this.a.lbs.r);
    const x2 = rotateX(x, r, this.a.lbs.r);
    const y2 = rotateY(y, r, this.a.lbs.r);
    c.globalAlpha = this.a.lbs.t;
    c.beginPath();
    c.arc(x2, y2, r2, 2 * Math.PI, false);
    c.fillStyle = this.c;
    c.fill();
    c.globalAlpha = 1;
    // Draw first stroke elem #2
    const r3 = r * 0.07;
    this.a.lbt.r += this.computeRotation(this.a.lbt.r);
    const x3 = rotateX(x, r, this.a.lbt.r);
    const y3 = rotateY(y, r, this.a.lbt.r);
    c.globalAlpha = this.a.lbt.t;
    c.beginPath();
    c.arc(x3, y3, r3, 2 * Math.PI, false);
    c.fillStyle = this.c;
    c.fill();
    c.globalAlpha = 1;

    // Draw second
    const r4 = r * 1.4;
    c.globalAlpha = this.a.lsf.t;
    c.beginPath();
    c.arc(x, y, r4, 2 * Math.PI, false);
    c.lineWidth = 1;
    c.strokeStyle = this.c;
    c.stroke();
    c.globalAlpha = 1;
    // Draw second stroke elem #1
    const r5 = r * 0.04;
    this.a.lbf.r -= this.computeRotation(this.a.lbf.r);
    const x5 = rotateX(x, r4, this.a.lbf.r);
    const y5 = rotateY(y, r4, this.a.lbf.r);
    c.globalAlpha = this.a.lbf.t;
    c.beginPath();
    c.arc(x5, y5, r5, 2 * Math.PI, false);
    c.fillStyle = this.c;
    c.fill();
    c.globalAlpha = 1;
  }

  drawCornerRightCircles(c, p) {
    // Do not draw corner circles, if the
    // viewport width is not 1200px at least.
    if (this.W < 1200) return;

    const { r } = this;

    // Draw first stroke.
    const x = this.W;
    const y = p.y - this.H / 2;
    c.globalAlpha = this.a.rsf.t;
    c.beginPath();
    c.arc(x, y, r, 2 * Math.PI, false);
    c.lineWidth = 1;
    c.strokeStyle = this.c;
    c.stroke();
    c.globalAlpha = 1;
    // Draw first stroke element.
    const r2 = r * 0.07;
    this.a.rbf.r -= this.computeRotation(this.a.rbf.r);
    const x2 = rotateX(x, r, this.a.rbf.r);
    const y2 = rotateY(y, r, this.a.rbf.r);
    c.globalAlpha = this.a.rbf.t;
    c.beginPath();
    c.arc(x2, y2, r2, 2 * Math.PI, false);
    c.fillStyle = this.c;
    c.fill();
    c.globalAlpha = 1;

    // Draw second stroke.
    const r3 = r * 1.4;
    c.globalAlpha = this.a.rss.t;
    c.beginPath();
    c.arc(x, y, r3, 2 * Math.PI, false);
    c.lineWidth = 1;
    c.strokeStyle = this.c;
    c.stroke();
    c.globalAlpha = 1;
    // Draw second stroke element.
    const r4 = r * 0.19;
    this.a.rbs.r += this.computeRotation(this.a.rbs.r);
    const x4 = rotateX(x, r3, this.a.rbs.r);
    const y4 = rotateY(y, r3, this.a.rbs.r);
    c.globalAlpha = this.a.rbs.t;
    c.beginPath();
    c.arc(x4, y4, r4, 2 * Math.PI, false);
    c.fillStyle = this.c;
    c.fill();
    c.globalAlpha = 1;
  }
}
