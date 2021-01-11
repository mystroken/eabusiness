import C2D from '../lib/C2D';

export default function init(app) {
  const c2d = new C2D({
    el: document.querySelector('#c2d0'),
  });
  return c2d;
}
