/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
import round from '@mystroken/g/round';
import ScrollManager from '@mystroken/s';

/**
 * @typedef ScrollParameters
 * @type {Object}
 * @property {Number=} upper The upper bound of scroll.
 * @property {Number=} lower The lower bound of scroll.
 * @property {Function} on The callback to call on each scroll operation.
 * @property {Function} start The callback to call on start of a scroll operation.
 * @property {Function} end The callback to call on end of a scroll operation.
 */
const defaultParameters = {
  on: null,
  start: null,
  end: null,
};

/**
 * @typedef ScrollInstance
 * @type {Object}
 * @property {Number} amount The current amount of scroll.
 * @property {Function} on Enable listening
 * @property {Function} off Turn off the listening.
 * @property {Function} set Overrides the parameters.
 */

/**
 * Initialize the scroll listeners.
 * @param {ScrollParameters} params scroll parameters.
 * @returns {ScrollInstance}
 */
export default function initializeScrollListener(params = {}) {
  let instance = {};
  // let callback = null;

  let last = 0;
  let target = 0;
  let current = 0;
  let direction = 0;
  // let velocity = 0;
  const rAF = { id: null, ticking: false };

  const onScroll = { callback: null };
  const onScrollEnd = { timer: null, callback: null };
  const onScrollStart = { lock: false, callback: null };

  const scrollObserver = new ScrollManager({
    el: document,
    preventTouch: true,
    mouseMultiplier: 0.618,
    touchMultiplier: 2.4,
  });

  /**
   * Run a loop to ease scroll
   * and positionate slides.
   */
  function runLoop() {
    rAF.ticking = true;

    // Compute.
    current += (target - current) * 0.07;
    current = round(current, 3);

    // If the current value is equal to the last one,
    // This means that we don't need anymore to run the loop.
    if (current === last) {
      rAF.id = cancelAnimationFrame(runLoop);
      rAF.ticking = false;
    } else { rAF.id = requestAnimationFrame(runLoop); }

    // Notify the onScroll listener.
    if (typeof onScroll.callback === 'function') onScroll.callback(current);

    // Keep track of the last value.
    last = current;
  }

  /**
   * Clamp the target amount.
   */
  function clampTarget() {
    // target = round(wrap(lowerBoundLimit, upperBoundLimit, target), 3);
  }

  function setTheEndOfTheScroll() {
    // Call the callback
    if (onScrollEnd.callback) onScrollEnd.callback();

    // Unlock the onScrollStart lock.
    onScrollStart.lock = false;
  }

  /**
   * Get the scroll amount.
   * @param {Event} event scroll event interface.
   */
  function takeScroll(event) {
    // Notify the start event.
    if (!onScrollStart.lock
      && (typeof onScrollStart.callback === 'function')) {
      onScrollStart.callback();
      onScrollStart.lock = true;
    }

    // Calculate the target value.
    const newTarget = target - event.deltaY;
    direction = (newTarget - target) > 0 ? 1 : -1;
    target = newTarget;
    clampTarget();

    // Plan the end scroll in
    // order to notify the listener.
    onScrollEnd.timer && window.clearTimeout(onScrollEnd.timer);
    onScrollEnd.timer = window.setTimeout(setTheEndOfTheScroll, 400);

    if (rAF.ticking === false) rAF.id = requestAnimationFrame(runLoop);
  }

  /**
   * Attach event listeners.
   */
  function addEvents() {
    scrollObserver.on(takeScroll);
  }

  /**
   * Dettach event listeners.
   */
  function removeEvents() {
    scrollObserver.destroy();
  }

  /**
   * Get parameters.
   * @param {SliderParameters} parameters parameters.
   */
  function getParameters(parameters) {
    const {
      on,
      start,
      end,
    } = Object.assign(defaultParameters, parameters);
    onScroll.callback = on;
    onScrollStart.callback = start;
    onScrollEnd.callback = end;
  }

  instance = {
    direction,
    on: addEvents,
    off: removeEvents,
    set: getParameters,
  };

  instance.set(params);

  Object.defineProperty(instance, 'amount', {
    get: () => current,
  });

  return instance;
}
