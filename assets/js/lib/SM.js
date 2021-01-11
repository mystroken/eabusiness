/* eslint-disable implicit-arrow-linebreak */
import bindAll from '@mystroken/g/bindAll';
import clamp from '@mystroken/g/clamp';
import round from '@mystroken/g/round';
import Raf from '@mystroken/g/Raf';
import Delay from '@mystroken/g/Delay';
import forEachIn from '@mystroken/g/forEachIn';
import S from '@mystroken/s';

const getSections = s => {
  const sections = [];

  if (Array.isArray(s)) return s.map(e => getSections(e)).map(a => a[0]);

  if (s instanceof HTMLCollection || s instanceof NodeList) {
    forEachIn(Array.from(s))(e =>
      sections.push({ el: e, b: null }));
    return sections;
  }

  if (s instanceof HTMLElement || s instanceof Node) {
    sections.push({ el: s, b: null });
    return sections;
  }

  throw new TypeError('Sections must be DOM elements.');
};

export default class SM {
  constructor(o) {
    bindAll(this, ['calc', 'removeClasses', 'resize', 'run']);

    // Get the listener.
    // The listener is used to attach/detach
    // event listeners.
    this.l = o.listener || document;

    // Get the content container.
    // The container is used to calculate the
    // content height.
    this.c = o.container || document.body;

    // Get the sections to move up/down
    this.s = o.sections ? getSections(o.sections) : getSections(this.c);

    // Add "pointer-events: none" to each element with
    // an hover state when the user scroll.
    // It significantly improve performance on scroll.
    this.p = o.p || null;

    // Set a callback to be notified each
    // time the scroll value change.
    this.onUp = o.onUpdate || null;

    // SM variables.
    this.v = {
      // Boundings.
      b: 0,
      // Current value.
      c: 0,
      // Last value.
      l: 0,
      // Ease.
      e: o.ease || 0.075,
      // Window height,
      H: 0,
      // Target
      t: 0,
      // are Sections moving
      moving: false,
      // Ticking
      ticking: false,
      // CSS ClassName
      class: 'is-scrolling',
    };

    // Scroll acceleration.
    this.a = 0;

    this.sm = new S({
      el: this.l,
      mouseMultiplier: o.mouseMultiplier || 0.55, // 0.618,
      touchMultiplier: o.touchMultiplier || 2.4,
      firefoxMultiplier: o.firefoxMultiplier || 34,
      preventTouch: o.preventTouch || true,
    });

    this.rAF = new Raf(this.run);
    this.delay = new Delay(this.removeClasses, 400);
  }

  init() {
    this.resize();
    // forEach(this.s)(section => section.el.style['will-change'] = 'transform');
  }

  calc(e) {
    const d = e.deltaY;
    this.v.t += d * -1;

    // Clamp the scroll target.
    this.clampTarget();

    if (!this.v.ticking) {
      requestAnimationFrame(() => {
        // this.addClasses();
        if (this.p) this.p.style.pointerEvents = 'all';
        this.delay.run();
        this.v.ticking = false;
      });
      this.delay.stop();
      this.v.ticking = true;
    }

    if (this.v.moving === false) this.rAF.run();
  }

  clampTarget() {
    this.v.t = round(clamp(this.v.t, 0, (this.v.b.height - this.v.H)), 4);
  }

  off() {
    this.rAF.stop();
    this.removeEvents();
  }

  on() {
    this.addEvents();
    this.rAF.run();
  }

  resize() {
    // Get the current viewport height.
    this.v.H = window.innerHeight;

    // Get the current container bounds.
    this.v.b = this.c.getBoundingClientRect();

    // Clamp the scroll target.
    this.clampTarget();

    // Get the current bounds of sections.
    forEachIn(this.s)(section => {
      section.el.style.transform = `translate3d(0,${-1 * this.v.c}px,0)`;
      const bound = section.el.getBoundingClientRect();
      section.b = {};
      section.b.top = bound.top + this.v.c;
      section.b.bottom = bound.bottom + this.v.c;
    });
  }

  run() {
    this.v.moving = true;
    this.v.c += (this.v.t - this.v.c) * this.v.e;
    this.v.c = Number(this.v.c.toFixed(4));
    if (this.v.c <= 0.001) this.v.c = 0;

    // Calculate the acceleration.
    this.a = this.v.t - this.v.c;

    // console.log('Run the loop...', this.v.c, ' – ', this.v.t, ' – Max: ', this.v.b.height);

    // If the current value is equal to the last one,
    // This means that we don't need anymore to run the loop.
    if (this.v.c === this.v.l) {
      this.rAF.stop();
      this.v.moving = false;
    }

    // Slide sections.
    forEachIn(this.s)(section => this.positionateSection(section));

    // Callback
    if (typeof this.onUp === 'function') this.onUp(this.v.c);

    // Keep track of the last value.
    this.v.l = this.v.c;
  }

  /**
   * Positionate a section on a the page according to the scroll amount.
   * @param {*} section
   */
  positionateSection(section) {
    const bleed = 300;
    const topLimit = (section.b.top - bleed) - this.v.H;
    const bottomLimit = section.b.bottom + bleed;
    const isScrollInInterval = this.v.c >= topLimit && this.v.c <= bottomLimit;

    if (isScrollInInterval) section.el.style.transform = `translate3d(0,${-1 * this.v.c}px,0)`;
  }

  addClasses() {
    document.body.classList.add(this.v.class);
  }

  removeClasses() {
    // document.body.classList.remove(this.v.class);
    if (this.p) this.p.style.pointerEvents = 'none';
  }

  addEvents() {
    this.sm.on(this.calc);
    window.addEventListener('resize', this.resize);
  }

  removeEvents() {
    this.sm.off(this.calc);
    window.removeEventListener('resize', this.resize);
  }
}
