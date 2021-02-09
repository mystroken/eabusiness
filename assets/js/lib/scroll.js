/**
 * @typedef ScrollParameters
 * @type Object
 * @property {HTMLElement} container Determines the container.
 * @property {HTMLElement[]} elements Determines elements to slide.
 */

/**
 * @typedef ScrollInstance
 */

/**
 * @type {ScrollInstance}
 */
let instance = null

/**
 *
 * @param {HTMLElement} element
 */
function getComputedHeightFrom(element) {
  const computedHeightString = getComputedStyle(element).height;
  const elementHeight = Number(computedHeightString.replace('px', ''));
  return elementHeight;
};

/**
 * Create a new scroll instance.
 * @param {ScrollParameters} params
 * @returns {ScrollInstance}
 */
function create(params) {
  // Current scroll position
  let current = 0
  // Target scroll position
  let target = 0
  // Ease or speed for moving from `current` to `target`
  const ease = 0.1
  // Utility variables for `requestAnimationFrame`
  var rafId = undefined
  var rafActive = false
  // Container element
  const container = params.container
  // Array with elements to slide
  const slides = params.elements
  // Variables for storing dimmensions
  let containerHeight
  // The `fakeScroll` is an element to make the page scrollable
  // Here we are creating it and appending it to the `body`
  const fakeScroll = document.createElement('div')

  function appendFakeScroll() {
    fakeScroll.className = 'fake-scroll'
    document.body.appendChild(fakeScroll)
  }

  function removeFakeScroll() {
    document.body.removeChild(fakeScroll)
  }

  /**
   * Getting dimmensions and
   * setting up all for animation.
   */
  function setupAnimation() {
    // Updating dimmensions
    containerHeight = getComputedHeightFrom(container)
    // Set `height` for the fake scroll element
    fakeScroll.style.height = containerHeight + 'px'
    // Start the animation, if it is not running already
    startAnimation()
  }

  /**
   * Start the animation, if it is
   * not running already.
   */
  function startAnimation() {
    if (!rafActive) {
      rafActive = true
      rafId = requestAnimationFrame(updateAnimation)
    }
  }

  /**
   * Do calculations and apply CSS `transform`s accordingly.
   */
  function updateAnimation() {
    // Difference between `target` and `current` scroll position
    var diff = target - current
    // `delta` is the value for adding to the `current` scroll position
    // If `diff < 0.1`, make `delta = 0`, so the animation would not be endless
    var delta = Math.abs(diff) < 0.1 ? 0 : diff * ease

    if (delta) { // If `delta !== 0`
      // Update `current` scroll position
      current += delta
      // Round value for better performance
      current = parseFloat(current.toFixed(3))
      // Call `update` again, using `requestAnimationFrame`
      rafId = requestAnimationFrame(updateAnimation)
    } else { // If `delta === 0`
      // Update `current`, and finish the animation loop
      current = target
      rafActive = false
      cancelAnimationFrame(rafId)
    }

    // Set the CSS `transform` corresponding to
    // the custom scroll effect.
    slides.forEach(function(slide) {
      slide.style.transform = 'translate3d(0,'+ -current +'px,0)'
    })
  }

  /**
   * Update scroll `target`, and start
   * the animation if it is not running already.
   */
  function updateScroll() {
    target = window.scrollY || window.pageYOffset
    startAnimation()
  }

  function addEvents() {
    // Listen for `resize` event to recalculate dimmensions
    window.addEventListener('resize', setupAnimation)
    // Listen for `scroll` event to update `target` scroll position
    window.addEventListener('scroll', updateScroll)
  }

  function removeEvents() {
    // Listen for `resize` event to recalculate dimmensions
    window.removeEventListener('resize', setupAnimation)
    // Listen for `scroll` event to update `target` scroll position
    window.removeEventListener('scroll', updateScroll)
  }

  function on() {
    container.classList.add('virtual-scroll')
    appendFakeScroll()
    addEvents()
    setupAnimation()
  }

  function off() {
    removeEvents()
    removeFakeScroll()
    container.classList.remove('virtual-scroll')
  }

  return { on,  off };
}

/**
 * Returns a new instance
 * only if there was no one.
 * (Singletton pattern)
 * @param {ScrollParameters} params
 */
function initialize(params) {
  instance = (instance === null) ? create(params) : instance
  return instance
}

export default initialize;
