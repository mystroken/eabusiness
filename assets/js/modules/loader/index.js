import Loader from './Loader';
import Shape from './Shape';

export default function init() {
  const cssClassIsLoading = 'is-loading';
  const cssClassIsLoaded = 'is-loaded';
  const appContainer = document.querySelector('#app');
  const loaderContainer = appContainer.querySelector('#loader');
  const shape = new Shape();

  function onShowLoader(done) {
    // Change the class of the app.
    appContainer.classList.remove(cssClassIsLoaded);
    appContainer.classList.add(cssClassIsLoading);
    // Draw renderables.
    shape.draw().then(() => done());
  }

  function onHideLoader(done) {
    // Change the class of the app.
    appContainer.classList.add(cssClassIsLoaded);
    appContainer.classList.remove(cssClassIsLoading);
    // Undraw renderables.
    shape.undraw().then(() => done());
  }

  const loader = Loader({
    show: onShowLoader,
    hide: onHideLoader,
    container: loaderContainer,
    sliderContainer: loaderContainer.querySelector('#loader-txt'),
    brandName: loaderContainer.querySelector('#loader-txt-name-w .txt-p-l'),
    services: loaderContainer.querySelectorAll('#loader-txt-services-w .txt-p-l'),
  });

  loader.shapes = shape;
  return loader;
}
