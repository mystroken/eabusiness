/* eslint-disable object-curly-newline */
import animate from '@mystroken/g/animate';
import Timeline from '@mystroken/g/Timeline';
import forEachIn from '@mystroken/g/forEachIn';

function instantiate() {
  let isExpanded = false;

  const filter = document.querySelector('.pp__filter');
  const closer = filter.querySelector('.pp__filter__close-btn');
  const wrapper = filter.querySelector('.pp__filter__content__overlay');
  const links = Array.prototype.slice.call(filter.querySelectorAll('.pp__filter__option__link'));
  const toggler = filter.querySelector('.pp__filter__toggler');
  const icon = toggler.querySelector('.pp__filter__toggler__icon');
  const labelOpen = toggler.querySelector('.pp__filter__toggler__label__open');
  const labelClose = toggler.querySelector('.pp__filter__toggler__label__close');

  const oTimeline = new Timeline();
  const cTimeline = new Timeline();
  const labelOtimeline = new Timeline();
  const labelCtimeline = new Timeline();

  // Filter opening
  const iconHide = animate({ el: icon, e: 'o6', d: 800, p: { y: -120, opacity: 0 } });
  const wrapperExpand = animate({ el: wrapper, e: 'o6', d: 800, p: { scaleX: 1 } });
  const linksShow = animate({ el: links, d: 1200, e: 'o6', p: { y: 0 } });
  const closerShow = animate({ el: closer, d: 1000, p: { opacity: 1 } });

  const labelOpenHide = animate({ el: labelOpen, e: 'o6', p: { y: -120 } });
  const labelCloseShow = animate({ el: labelClose, e: 'o6', p: { y: 0 } });
  labelOtimeline
    .add(labelOpenHide)
    .add(labelCloseShow, 150);


  oTimeline
    .add(wrapperExpand)
    .add(closerShow, `-=${closerShow.duration}`)
    .add(linksShow, 150)
    .add(iconHide, 0)
    .add(labelOtimeline, `-=${labelOtimeline.duration - 150}`);


  // Filter closing.
  const iconShow = animate({ el: icon, d: 400, p: { y: 0, opacity: 1 } });
  const linksHide = animate({ el: links, d: 200, p: { y: 120 } });
  const wrapperCollapse = animate({ el: wrapper, d: 400, p: { scaleX: 0 } });
  const closerHide = animate({ el: closer, d: 200, p: { opacity: 0 } });

  const labelOpenShow = animate({ el: labelOpen, d: 400, p: { y: 0 } });
  const labelCloseHide = animate({ el: labelClose, d: 400, p: { y: 100 } });
  labelCtimeline
    .add(labelCloseHide)
    .add(labelOpenShow, 0);


  cTimeline
    .add(linksHide)
    .add(closerHide, 0)
    .add(wrapperCollapse, 0)
    .add(iconShow, `-=${iconShow.duration}`)
    .add(labelCtimeline, `-=${labelCtimeline.duration}`);


  /**
   * Initialize the scene.
   * Place the different elements.
   */
  function initialize() {
    closer.style.opacity = 0;
    icon.style.opacity = 1;
    icon.style.transform = 'translate3d(0,0,0)';
    labelOpen.style.transform = 'translate3d(0,0,0)';
    labelClose.style.transform = 'translate3d(0,120%,0)';
    forEachIn(links)(link => { link.style.transform = 'translate3d(0,120%,0)'; });
  }

  /**
   * Expand the filter.
   * @returns {Promise}
   */
  function expand(event) {
    event.preventDefault();
    if (!isExpanded) {
      isExpanded = true;
      cTimeline.stop();
      return new Promise(resolve => {
        oTimeline.play({
          cb: () => {
            filter.classList.add('is-expanded');
            resolve();
          },
        });
      });
    }
    return Promise.resolve();
  }

  /**
   * Collapse the filter.
   * @returns {Promise}
   */
  function collapse(event) {
    event.preventDefault();
    if (isExpanded) {
      isExpanded = false;
      oTimeline.stop();
      return new Promise(resolve => {
        cTimeline.play({
          cb: () => {
            filter.classList.remove('is-expanded');
            resolve();
          },
        });
      });
    }
    return Promise.resolve();
  }

  /**
   * Toggle the filter.
   * @returns {Promise}
   */
  function toggle(event) {
    if (!isExpanded) return expand(event);
    return collapse(event);
  }

  /**
   * Turn on the filter.
   * Attach event listeners.
   */
  function on() {
    toggler.addEventListener('click', toggle);
    closer.addEventListener('click', collapse);
  }

  /**
   * Turn off the filter.
   * Remove event listeners.
   */
  function off() {
    toggler.removeEventListener('click', toggle);
    closer.removeEventListener('click', collapse);
  }

  return {
    on,
    off,
    initialize,
    expand,
    toggle,
    collapse,
    isExpanded,
  };
}

export default instantiate;
