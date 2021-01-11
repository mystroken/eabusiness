/* eslint-disable object-curly-newline */
/* eslint-disable no-return-assign */

function createNewInstance(params) {
  // Get parameters.
  let interrupted = true;
  // const { container } = params;

  function on() {
    if (interrupted) {
      interrupted = false;
    }
  }

  function off() {
    if (!interrupted) {
      interrupted = true;
    }
  }


  return {
    interrupted,
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
