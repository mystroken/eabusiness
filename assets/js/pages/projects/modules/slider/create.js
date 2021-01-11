/* eslint-disable no-console */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-return-assign */
/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
import { TextureLoader } from 'three';
import animate from '@mystroken/g/animate';
import Timeline from '@mystroken/g/Timeline';
import round from '@mystroken/g/round';
import forEachIn from '@mystroken/g/forEachIn';
import Scene from './Scene';
import initializeScrollListener from './scroll';
import instantiateFilterController from './filter';

/**
 * @typedef SlideBounds
 * @type {Object}
 * @property {Number} x The position on x-axis.
 * @property {Number} y The position on y-axis.
 * @property {Number} width The width of the slide.
 * @property {Number} height The height of the slide.
 * @property {Number} min The min y value.
 * @property {Number} max The height of the slide.
 */


/**
 * @typedef Slide
 * @type {Object}
 * @property {String} image The URL of the slide image.
 * @property {SlideBounds} bounds The bounds of the slide.
 */

/**
 * Wrap a value.
 * When the value reach the end,
 * start over again.
 * @param {Number} min The minimum value of the range.
 * @param {Number} max The maximum value of the range.
 * @param {Number} value The value of the range.
 * @returns {Number}
 */
function wrap(min, max, value) {
  const range = max - min;
  return (range + (value - min) % range) % range + min;
}

/**
 * Get the dimension of a slide item.
 * @param {{width:Number, height:Number}} viewport The viewport dimension.
 * @returns {{width:Number, height:Number, gutter:Number}}
 */
function getSlideSize(viewport) {
  const gutter = 24;
  // const width = viewport.width * 0.3;
  // const height = width / 1.5;
  const height = viewport.height * 0.36;
  const width = height * 1.5;

  return { gutter, width, height };
}

/**
 * Get the total length of an amount of slides.
 * @param {Integer} num the number of slides.
 * @param {{width:Number, height:Number}} viewport The current viewport size.
 * @returns {Number} The total length.
 */
function getSlidesHeight(num, viewport) {
  const {
    height,
    gutter,
  } = getSlideSize(viewport);

  return round(num * (height + gutter));
}


/**
 * Get the Bounding of a slide.
 * @param {Integer} index  The index of the slide.
 * @param {{width: Number, height: Number}} viewport The relative viewport.
 * @returns {SlideBounds}
 */
function getBoundingSlideRect(index, viewport) {
  const {
    width,
    height,
    gutter,
  } = getSlideSize(viewport);

  const bounds = {};
  bounds.x = 0;
  bounds.y = round(index * (height + gutter));
  bounds.width = round(width);
  bounds.height = round(height);
  return bounds;
}

/**
 * Compute the slides bounds.
 * And returns some important dimensions:
 * - Height of the slider
 * - Max scroll size
 * @param {[Slide]} slides An array of slide.
 * @param {{ width: Number, height: Number }} viewport The viewport for relative positioning.
 * @returns {{min: Number, max: Number, height: Number}}
 */
function computeSlidesBounds(slides, viewport) {
  const forEachSlide = forEachIn(slides);
  const slidesLength = slides.length;

  // Get the bounds of each slide.
  forEachSlide((slide, index) => (
    slide.bounds = getBoundingSlideRect(index, viewport)
  ));

  // Since we know bounds.
  // We can calculate now the slider height
  // and the max scroll value.
  const lastSlideBounds = slides[slides.length - 1].bounds;
  const sliderHeight = lastSlideBounds.y + lastSlideBounds.height;
  const maxScrollValue = sliderHeight;
  const minScrollValue = 0;

  // First item is at the
  // center position.
  // Divide the rest by two and
  // align them proportionnally around
  // the sides of the first one.
  const slidesToRangeOnBottom = Math.ceil((slidesLength - 1) / 2);
  const slidesToRangeOnTop = (slidesLength - 1) - slidesToRangeOnBottom;

  const minValue = -(getSlidesHeight(slidesToRangeOnTop + 1, viewport));
  const maxValue = getSlidesHeight(slidesToRangeOnBottom, viewport);

  // Knowing the slider bounds.
  // We're should clamp the scroll
  // value of each slide too.
  forEachSlide(slide => {
    slide.bounds.min = minValue;
    slide.bounds.max = maxValue;
  });

  return {
    min: minScrollValue,
    max: maxScrollValue,
    height: sliderHeight,
  };
}

/**
 * Load image.
 * @param {TextureLoader} loader
 * @param {string} url
 * @param {int} index
 * @returns {Promise}
 */
function loadTexture(loader, url, index) {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve({ texture: null, index });
      return;
    }

    loader.load(
      url,
      texture => {
        resolve({ texture, index });
      },
      undefined,
      error => {
        console.error('Failed to load texture');
        reject(error);
      },
    );
  });
}

/**
 * Generate the slider slide collection.
 * @param {array} items The items of the slider.
 * @param {array} images The images.
 * @returns {Promise}
 */
function generateSlideCollection(items, images) {
  // Generate the slides items.
  const promises = [];
  const THREEtextureLoader = new TextureLoader();

  const slides = items.map((item, index) => {
    promises.push(
      loadTexture(
        THREEtextureLoader,
        images[index],
        index,
      ),
    );

    return {
      texture: null,
      bounds: { x: 0, y: 0, width: 0, height: 0 },
    };
  });

  return new Promise(resolve => {
    Promise.all(promises).then(aLL => {
      aLL.forEach(promise => {
        const { texture, index } = promise;
        slides[index].texture = texture;
      });
      resolve(slides);
    });
  });
}


/**
 * @typedef SliderParameters
 * @type {Object}
 * @property {{prepend:  Function, remove: Function}} gl The canvas interface for adding WebGL Scenes.
 * @property {NodeCollection} items The items of the slider.
 * @property {NodeCollection} images The images of the items.
 */


/**
 * @typedef SliderInstance
 * @type {Object}
 * @property {Function} on Turn on the slider.
 * @property {Function} off Turn off the slider.
 * @property {Function} pause Pause the slider.
 * @property {Function} resume Resume the slider (after pausing).
 */

/**
 * Create a new Slider instance.
 * Slider knows about scroll and slides.
 * @param {SliderParameters} params
 * @returns SliderInstance
 */
function createSliderInstance(params) {
  let isPaused = false;
  let scroll = null;
  let slides = null;
  let scene = null;
  let rAF = null;
  let currentIndex = 0;

  // Instantiate the filter controller.
  const filterController = instantiateFilterController();

  // System bouds.
  const viewport = {
    width: 0, // The width of the screen.
    height: 0, // The height of the screen.
  };

  const bounds = {
    min: 0, // The minimum scroll to value.
    max: 0, // The maximum scroll to value.
    height: 0, // The total height of the slider.
  };

  // Retrieve parameters.
  const {
    gl,
    items,
    images,
  } = params;

  /**
   * Setting up the slider.
   */
  function setUp() {
    return new Promise(resolve => {
      // Init the scroll
      // manager with initial params.
      scroll = initializeScrollListener();

      // Initialize filter.
      filterController.initialize();

      // Prepare slides.
      // Generate them first,
      // And set their initial bounds.
      generateSlideCollection(items, images)
        .then(slideElements => {
          slides = slideElements;
          setElementsBounds();

          // Prepare the
          // 3D scene.
          scene = Scene({ slides, viewport });

          resolve();
        });
    });
  }

  /**
   * Compute the bounds of
   * the slider world.
   */
  function setElementsBounds() {
    // Process
    // Take current bounds.
    // Notify components.

    // Get the screen sizes.
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;

    // Compute
    // slides bounds.
    const {
      min, // The minimum scroll to see top.
      max, // The maximum scroll to see bottom.
      height, // The total height of slides.
    } = computeSlidesBounds(slides, viewport);

    // Set the bounds
    // of the slider.
    bounds.min = min;
    bounds.height = height;
    bounds.max = max;

    // After computation,
    // Notify others (scroll & scene)
    scroll.set({
      on: onScroll,
      end: onScrollEnd,
      start: onScrollStart,
    });
  }

  /**
   * Attach event listeners.
   */
  function addEvents() {
    // Positionate slides.
    onScroll();

    // Enable scroll listening.
    scroll.on();

    // Enable the filter.
    filterController.on();

    // On resize,
    // Re-calculate the bounds of elements.
    window.addEventListener('resize', setElementsBounds);
  }

  function onScroll() {
    // Get the current slide.
    const slideHeight = getSlidesHeight(1, viewport);
    const scrollLength = Math.abs(scroll.amount / slideHeight);
    currentIndex = wrap(0, slides.length, Math.floor(scrollLength));
    // console.log(currentIndex);

    // Set the new position of each slides.
    forEachIn(slides)((slide, index) => {
      const translate = round(getBoundingSlideRect(index, viewport).y - scroll.amount, 3);
      slide.bounds.y = wrap(slide.bounds.min, slide.bounds.max, translate);
    });
  }

  function onScrollStart() {
    // console.log(`Start: ${currentIndex}`);
    // console.log(items[currentIndex]);
    // Hide current slide item.
    const item = items[0];
    const itemTitle = item.querySelector('.project__title a');
    const itemCategories = item.querySelectorAll('.project__categories .txt-p-l');
    const itemActionLine = item.querySelector('.project__link__line');
    const itemActionLabel = item.querySelector('.project__link__label .txt-p-l');

    const duration = 400;
    const easing = 'o4';
    const titleHide = animate({ el: itemTitle, d: duration, p: { y: [0, 100] }, e: easing });
    const categoriesHide = animate({ el: itemCategories, d: duration, p: { y: [0, 100] }, e: easing });
    const actionLineHide = animate({ el: itemActionLine, d: 200, p: { scaleX: [1, 0] }, e: easing });
    const actionLabelHide = animate({ el: itemActionLabel, d: duration, p: { y: [0, 100] }, e: easing });

    const timeline = new Timeline();
    timeline
      .add(titleHide)
      .add(categoriesHide, 0)
      .add(actionLineHide, 0)
      .add(actionLabelHide, 0);
    timeline.play();
  }

  function onScrollEnd() {
    // console.log(`End: ${currentIndex}`);
    // Show current slide item.
    const item = items[0];
    const itemTitle = item.querySelector('.project__title a');
    const itemCategories = item.querySelectorAll('.project__categories .txt-p-l');
    const itemActionLine = item.querySelector('.project__link__line');
    const itemActionLabel = item.querySelector('.project__link__label .txt-p-l');

    const easing = 'o6';
    const duration = 1000;
    const titleShow = animate({ el: itemTitle, p: { y: [100, 0] }, e: easing, d: duration });
    const categoriesShow = animate({ el: itemCategories, p: { y: [100, 0] }, e: easing, delay: i => i * 50, d: duration });
    const actionLineShow = animate({ el: itemActionLine, p: { scaleX: [0, 1] }, e: easing, d: duration });
    const actionLabelShow = animate({ el: itemActionLabel, p: { y: [100, 0] }, e: easing, d: duration });

    const timeline = new Timeline();
    timeline
      .add(titleShow)
      .add(categoriesShow, 100)
      .add(actionLineShow, 0)
      .add(actionLabelShow, 150);
    timeline.play();
  }

  /**
   * Dettach event listeners.
   */
  function removeEvents() {
    if (rAF) rAF.stop();
    // Stop listening the scroll.
    scroll.off();
    // Stop the filter.
    filterController.off();
    window.removeEventListener('resize', setElementsBounds);
  }

  /**
   * Turn on the slider.
   */
  function turnOn() {
    // Process
    // Run entrance animation
    // Add event listeners
    // Add shapes on canvas.

    addEvents();
    gl.prepend(scene);
  }

  /**
   * Turn off the slider.
   */
  function turnOff() {
    // Process
    // Destroy event listeners.
    // Remove shapes from canvas.

    removeEvents();
    gl.remove(scene);
    scroll = null;
    slides = null;
    scene = null;
    rAF = null;
  }

  /**
   * Pause the slider
   * When the menu is open.
   */
  function pause() {
    if (isPaused) return;
    // Process (only if its not currently paused)
    // Turn off event listeners.
    // Set 3D Scene rendering to false.

    removeEvents();
    scene.v.needRender = false;
    isPaused = true;
  }

  /**
   * Resume the slider.
   * When the menu is closed.
   */
  function resume() {
    if (!isPaused) return;
    // Process (only if it's currently paused)
    // Turn on event listeners.
    // Set 3D Scene rendering to true.

    addEvents();
    scene.v.needRender = true;
    isPaused = false;
  }

  // Then, return our instance object.
  return {
    on: turnOn,
    off: turnOff,
    setUp,
    pause,
    resume,
    slides,
  };
}

export default createSliderInstance;
