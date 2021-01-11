import C2D from '../../lib/C2D';
import Cursor from './Cursor';

export default function init(app) {
  const cursorCanvas = new C2D({
    el: document.querySelector('#c2d1'),
  });

  // Add the custom cursor
  // only if there's a mouse.
  if (app.d.hasMouse) {
    const cursor = new Cursor({}, app);
    cursorCanvas.c.add(cursor);
  }

  return cursorCanvas;
}
