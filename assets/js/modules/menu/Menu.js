/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import initializeGL from '../gl/GL';
import Menu2DShapes from './2DShapes';
import Menu3DScene from './3DScene';
import ExplorableMenuAnimator from './animators/ExplorableMenuAnimator';
import TouchableMenuAnimator from './animators/TouchableMenuAnimator';
import initializeTouchExplorer from './interactions/TouchExplorer';
import initializeMouseExplorer from './interactions/MouseExplorer';


function createNewInstance(params) {
  let interaction;
  let animator;
  let initialized;
  let isDisplayed;
  const gl = initializeGL({ canvas: document.querySelector('#menugl') });

  // Retrieve params.
  const { app } = params;
  const onOpenCallback = (typeof params.open === 'function') ? params.open : null;
  const onCloseCallback = (typeof params.close === 'function') ? params.close : null;
  const deviceHasMouse = (typeof params.hasMouse !== 'undefined') ? params.hasMouse : false;

  // Animation elements.
  let shapes2D;
  let windowWidth = window.innerWidth;


  /**
   * When the browser is resized, we
   * need to change the re-arrange elements.
   */
  function onResize() {
    windowWidth = window.innerWidth;
  }

  /**
   * Attach events listeners.
   */
  function attachEvents() {
    window.addEventListener('resize', onResize);
  }

  /**
   * Remove events listeners.
   */
  function detachEvents() {
    window.removeEventListener('resize', onResize);
  }

  /**
   * Init the module.
   */
  function init() {
    /**
     * Initialize the instance
     */
    // Attach events listener.
    attachEvents();

    // Select elements.
    shapes2D = new Menu2DShapes();
    const appContainer = document.querySelector('#app');

    // Text lines to animate.
    const textBrand = appContainer.querySelector('#m-s-brand .txt-p-l');
    const textClose = appContainer.querySelector('#m-s-closer-w .txt-p-l');
    const textContact = appContainer.querySelector('#m-s-contact-link .txt-p-l');
    const textInfos = appContainer.querySelector('#m-s-info .txt-p-l');

    // Menu items to animate.
    const menuContainer = document.querySelector('#menu');
    const menuBackground = appContainer.querySelector('#m-s-bg');
    const menuLinks = menuContainer.querySelectorAll('.menu-link');
    const menuInfoLine = menuContainer.querySelectorAll('.menu-item__info__line');
    const menuInfoLabel = menuContainer.querySelectorAll('.menu-item__info__label');

    // Initialize interactions.
    interaction = deviceHasMouse
      ? initializeMouseExplorer({ menuContainer })
      : initializeTouchExplorer({ menuContainer });

    // Initialize animators.

    animator = deviceHasMouse
      ? new ExplorableMenuAnimator({
        e: {
          interaction,
          textBrand,
          textClose,
          textContact,
          textInfos,
          menuContainer,
          menuLinks,
          menuInfoLine,
          menuInfoLabel,
          menuBackground,
          shapes2D,
          shapes3D: Menu3DScene,
          windowWidth,
        } })
      : new TouchableMenuAnimator({
        e: {
          textClose,
          textContact,
          menuLinks,
          menuBackground,
          shapes2D,
          shapes3D: Menu3DScene,
        } });
  }

  /**
   * Turn on the module.
   */
  function on() {
    if (!initialized) {
      init();
      animator.init();
      // Add shapes on Canvas 2D & 3D.
      app.m.cursor.c.prepend(shapes2D);
      gl.add(Menu3DScene);
      gl.on();
      initialized = true;
    }
  }

  /**
   * Turn off the module.
   */
  function off() {
    // Turn Off interactions.
    interaction.off();
    // Removes shapes from Canvas 2D & 3D.
    app.m.cursor.c.remove(shapes2D);
    gl.remove(Menu3DScene);
    gl.off();
    // Detach events.
    detachEvents();
    initialized = false;
  }

  function close() {
    if (isDisplayed) {
      interaction.off();
      if (onCloseCallback) onCloseCallback();
      animator.runExit()
        .finally(() => {
          isDisplayed = false;
          Menu3DScene.v.needRender = false;
        });
    }
  }

  function open() {
    if (!isDisplayed) {
      Menu3DScene.v.needRender = true;
      animator.runEnter()
        .then(() => {
          interaction.on();
          if (onOpenCallback) onOpenCallback();
        })
        .finally(() => { isDisplayed = true; });
    }
  }

  function toggle() {
    if (!isDisplayed) open();
    else close();
  }

  function reset() {
    // Set up state variables.
    initialized = false;
    isDisplayed = false;
  }

  // Setup variables.
  reset();

  return {
    initialized,
    isDisplayed,
    on,
    off,
    open,
    close,
    toggle,
  };
}

// Keep the instance (Singleton).
let instance = null;

/**
 * Initialize the explorer
 * and returns the instance.
 * @params {Object} params Parameters.
 * @returns {MenuExplorerInstance}
 */
function initialize(params) {
  instance = (instance !== null) ? instance : createNewInstance(params);
  return instance;
}

export default initialize;
