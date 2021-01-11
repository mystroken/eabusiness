/* eslint-disable no-return-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
import createMouseExplorer from '@mystroken/mouse-explorer';

/**
 * @typedef MenuExplorerInstance
 * @type {Object}
 * @property {Function} on Turn on the explorer.
 * @property {Function} off Turn off the explorer.
 */


/**
 * Create a new explorer instance.
 * @param {Object} params
 * @returns MenuExplorerInstance
 */
function createNewInstance(params) {
  // Get parameters.
  let interrupted = true;
  const { menuContainer } = params;
  const mouseExplorer = createMouseExplorer({ section: menuContainer, ease: 0.074, center: true });


  function moveContainer({ x }) {
    menuContainer.style.transform = `translate3d(${x}px,0,0)`;
  }

  function addEvents() {
    mouseExplorer.on(moveContainer);
  }

  function removeEvents() {
    mouseExplorer.off(moveContainer);
  }

  function off() {
    if (!interrupted) {
      removeEvents();
      interrupted = true;
    }
  }

  function on() {
    if (interrupted) {
      addEvents();
      interrupted = false;
    }
  }

  return {
    interrupted,
    explorer: mouseExplorer,
    on,
    off,
  };
}

// Keep the instance here.
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
