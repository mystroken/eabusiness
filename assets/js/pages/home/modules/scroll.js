import SM from '../../../lib/SM';

export default function init() {
  const sm = new SM({
    listener: document.querySelector('#app'),
    container: document.querySelector('.home-page'),
    sections: [
      document.querySelector('#hero'),
      document.querySelector('#s0'),
      document.querySelector('#s1'),
      document.querySelector('#s2'),
      document.querySelector('#s3'),
      document.querySelector('#s4'),
      document.querySelector('#s5'),
      document.querySelector('#s6'),
    ],
    p: document.querySelector('#_p'),
    preventTouch: true,
    mouseMultiplier: 0.618,
    touchMultiplier: 1,
  });
  sm.init();
  return sm;
}
