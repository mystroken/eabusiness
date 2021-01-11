/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import Menu from './Menu';

export default function init(app) {
  const cssClass = 'menu-displayed';
  const appContainer = document.querySelector('#app');
  const closer = appContainer.querySelector('#m-s-closer');

  const menuBackground = document.querySelector('#m-s-bg');
  menuBackground.style.opacity = 0;

  const menu = Menu({
    app,
    hasMouse: app.d.hasMouse,
    open: () => {
      app.p.pause();
      appContainer.classList.add(cssClass);
    },
    close: () => {
      app.p.resume();
      appContainer.classList.remove(cssClass);
    },
  });

  // Activate closer.
  closer.addEventListener('click', e => {
    e.preventDefault();
    menu.toggle();
  });

  // Only for testing
  // ------------------
  const opener = appContainer.querySelector('#open-menu');
  opener.addEventListener('click', e => {
    e.preventDefault();
    menu.open();
  });
  // ----------------

  return menu;
}
