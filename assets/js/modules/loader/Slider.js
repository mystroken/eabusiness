/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import forEachIn from '@mystroken/g/forEachIn';
import animate from '@mystroken/g/animate';
import Timeline from '@mystroken/g/Timeline';


/**
 * The container width is the highest width of its elements.
 * @param {*} container
 * @param {*} items
 */
function fixContainerWidth(container, items) {
  let containerWidth = 0;
  forEachIn(Array.from(items))(item => {
    const { width } = item.getBoundingClientRect();
    if (width > containerWidth) containerWidth = width;
    item.parentNode.style.position = 'absolute';
  });

  container.style.width = `${containerWidth + 10}px`;
}

// function createNode(html) {
//   return new DOMParser().parseFromString(html, 'text/html').body.firstChild;
// }

function reverseArray(arr) {
  const newArr = [];
  const { length } = arr;
  // eslint-disable-next-line no-plusplus
  for (let i = length - 1; i >= 0; i--) newArr.push(arr[i]);
  return newArr;
}

/**
 * Split text inside an element.
 */
function splitText(element) {
  let html = '';
  const txt = element.innerText;
  const chars = txt.split('');

  // Generate a html content.
  forEachIn(chars)(char => {
    html += (char === ' ') ? '&nbsp;' : `<span class="js-letter">${char}</span>`;
  });

  // Insert the generated html.
  element.innerHTML = html;
}

/**
 * Split all texts of our slider.
 * @param {*} brand
 * @param {*} services
 */
function splitTexts(brand, services) {
  // Split brand name text.
  splitText(brand);

  // Split services text.
  forEachIn(Array.from(services))(item => splitText(item));
}

/**
 * Create a new explorer instance.
 * @param {Object} params
 * @returns MenuExplorerInstance
 */
function createNewInstance(params) {
  // Get parameters.
  let initialized;
  let interrupted;
  let brandTimeline;
  let servicesTimeline;
  let exitTimeline;
  let entranceTimeline;
  const {
    container,
    brandName,
    servicesItems,
  } = params;
  const servicesContainer = document.querySelector('#loader-txt-services');

  function runEntranceAnimation() {
    if (exitTimeline) exitTimeline.pause();
    if (entranceTimeline) {
      entranceTimeline.stop();
      entranceTimeline.play();
    }
  }

  function runExitAnimation() {
    if (entranceTimeline) entranceTimeline.pause();
    if (exitTimeline) {
      exitTimeline.stop();
      exitTimeline.play();
    }
  }

  function generateAnimations() {
    /**
     * Entrance animation.
     * --------------------------------
     */
    brandTimeline = new Timeline();
    servicesTimeline = new Timeline({ cb: () => {
      servicesTimeline.stop();
      servicesTimeline.play();
    } });
    entranceTimeline = new Timeline();
    exitTimeline = new Timeline();

    const allLetters = document.querySelectorAll('#loader .js-letter');
    const brandLetters = brandName.querySelectorAll('.js-letter');

    // Pre-animation dispositions.
    // eslint-disable-next-line no-return-assign
    forEachIn(Array.from(allLetters))(letter => letter.style.transform = 'translate3d(0,120%,0)');
    brandName.style.transform = 'translate3d(100%,0,0)';

    // Stagger the animations.
    brandTimeline
      .add(animate({ el: brandLetters, d: 800, delay: i => i * 35, p: { y: [120, 0], scale: [0, 1] } }))
      .add(animate({ el: brandName, e: 'o3', p: { x: 0 } }), '+=100');

    forEachIn(Array.from(servicesItems))((service, index) => {
      const letters = Array.from(service.querySelectorAll('.js-letter'));
      const reversedLetters = reverseArray(letters);
      const exitDuration = 600;
      const delay = index === 0 ? 0 : -1 * ((exitDuration / 2) + 350);

      servicesTimeline
        .add(animate({ el: letters, d: 600, delay: i => i * 35, p: { y: [120, 0] } }), delay)
        .add(animate({ el: reversedLetters, d: exitDuration, delay: i => i * 50, p: { y: [0, -120] } }));
    });

    entranceTimeline
      .add(brandTimeline)
      .add(servicesTimeline, '-=800');


    /**
     * Exit animation.
     * --------------------------------
     */
    exitTimeline
      .add(animate({ el: allLetters, e: 'linear', d: 200, p: { opacity: [1, 0] } }));
  }

  /**
   * Initalize the slider
   */
  function initializeInstance() {
    fixContainerWidth(servicesContainer, servicesItems);
    splitTexts(brandName, servicesItems);
    generateAnimations();
    // Now we can display the slider elements.
    container.style.opacity = 1;
    initialized = true;
  }

  function onResize() {
    fixContainerWidth(servicesContainer, servicesItems);
  }

  function addEvents() {
    window.addEventListener('resize', onResize);
  }

  function removeEvents() {
    window.removeEventListener('resize', onResize);
  }

  function off() {
    if (!interrupted) {
      removeEvents();
      runExitAnimation();
      interrupted = true;
    }
  }

  function on() {
    if (interrupted) {
      addEvents();
      runEntranceAnimation();
      interrupted = false;
    }
  }

  function reset() {
    initialized = false;
    interrupted = true;
  }

  reset();
  initializeInstance();

  return {
    initialized,
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
