import createSliderInstance from './create';

export default function init(page) {
  const items = [].slice.call(document.querySelectorAll('.pp__list__item'));
  const images = items.map(item => item.dataset.src);

  const slider = createSliderInstance({
    gl: page.a.m.gl,
    items,
    images,
  });
  return slider;
}
