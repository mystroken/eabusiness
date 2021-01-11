import initializeSlider from './Slider';

function createNewInstance(params) {
  let slider;
  let initialized;
  let isDisplayed;
  const {
    container,
    sliderContainer,
    brandName,
    services: servicesItems,
  } = params;

  const onShowCallback = (typeof params.show === 'function') ? params.show : null;
  const onHideCallback = (typeof params.hide === 'function') ? params.hide : null;

  /**
   * Init the module.
   */
  function init() {
    // Add the init class.
    container.classList.add('is-init');

    // Initialize the slider.
    slider = initializeSlider({
      brandName,
      servicesItems,
      container: sliderContainer,
    });
  }

  function show() {
    if (initialized && !isDisplayed) {
      return new Promise(resolve => {
        isDisplayed = true;
        if (slider) slider.on();
        if (onShowCallback) onShowCallback(resolve);
        else resolve();
      });
    }
    return Promise.resolve();
  }

  function hide() {
    if (initialized && isDisplayed) {
      return new Promise(resolve => {
        isDisplayed = false;
        if (slider) slider.off();
        if (onHideCallback) onHideCallback(resolve);
        else resolve();
      });
    }
    return Promise.resolve();
  }

  /**
   * Attach events listeners.
   */
  function attachEvents() {
    // window.addEventListener('load', hide);
  }

  /**
   * Remove events listeners.
   */
  function detachEvents() {
    // window.removeEventListener('load', hide);
  }

  function on() {
    if (!initialized) {
      init();
      attachEvents();
      if (slider) slider.on();
      initialized = true;
    }
  }

  function off() {
    if (initialized) {
      detachEvents();
      if (slider) slider.off();
      initialized = false;
    }
  }

  function reset() {
    // Set up state variables.
    initialized = false;
    isDisplayed = true;
  }

  // Setup variables.
  reset();

  return {
    show,
    hide,
    on,
    off,
  };
}

// Keep the instance (Singleton).
let instance = null;

function initialize(params) {
  instance = (instance !== null) ? instance : createNewInstance(params);
  return instance;
}

export default initialize;
