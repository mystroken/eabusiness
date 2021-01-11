import Canvas from '@mystroken/canvas';
import bindAll from '@mystroken/g/bindAll';
import Raf from '@mystroken/g/Raf';

export default class C2D {

  constructor(o) {
    bindAll(this, ['resize', 'run']);

    this.el = o.el;
    this.v = {};
    // Create the canvas.
    this.c = new Canvas(o.el);
    this.rAF = new Raf(this.run);
  }


  run() {
    this.c.render();
  }


  off() {
    this.rAF.stop();
    this.c.clear();
    this.removeEvents();
  }


  on() {
    this.resize();
    this.attachEvents();
    this.rAF.run();
  }


  resize() {
    this.c.resize(window.innerWidth, window.innerHeight);
  }


  attachEvents() {
    window.addEventListener('resize', this.resize);
  }


  removeEvents() {
    window.removeEventListener('resize', this.resize);
  }
}
