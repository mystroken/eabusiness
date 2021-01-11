import Slider from '../../../lib/Slider';

export default function init(app) {
  return new Slider({
    container: document.querySelector('#s-slider-w'),
    wheel: document.querySelector('#s-slider-wheel-svg'),
    projects: document.querySelectorAll('.s-slider-project-item'),
  });
}
