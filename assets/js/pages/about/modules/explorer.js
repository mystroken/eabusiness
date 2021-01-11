import AboutExplorer from '../../../lib/AboutExplorer';

export default function init(app) {
  console.log('Initialize the explorer');
  return new AboutExplorer({
    container: document.querySelector('.about-page'),
  });
}
