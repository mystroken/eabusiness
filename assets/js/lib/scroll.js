/**
 * @typedef ScrollParameters
 * @type Object
 * @property {HTMLElement|String|Array} el Determines the elements to animate.
 * @property {Object} p Define element properties to animate.
 * @property {Number|Function} d Determine the duration of each animation.
 * @property {Number|Function} delay Determine the delay of each animation.
 * @property {String|Function} e Determine the ease of animations.
 * @property {Function|null} update Set the callback to call on each frame during animations.
 * @property {Function|null} cb Set the callback to call when animations are done.
 */

/**
 * @typedef ScrollInstance
 */

/**
 * @type {ScrollInstance}
 */
let instance = null;

/**
 * Create a new scroll instance.
 * @param {ScrollParameters} params
 * @returns {ScrollInstance}
 */
function create(params) {
  /**
   * @type ScrollInstance
   */
  const scroll = {};
  return scroll;
}

/**
 * Returns a new instance
 * only if there was no one.
 * (Singletton pattern)
 * @param {ScrollParameters} params
 */
function initialize(params) {
  instance = (instance === null) ? create(params) : instance;
  return instance;
}

export default initialize;
