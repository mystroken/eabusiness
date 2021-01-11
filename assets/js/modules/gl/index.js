/* eslint-disable no-unused-vars */
import initializeGL from './GL';

export default function init(app) {
  return initializeGL({
    canvas: document.querySelector('#gl'),
  });
}
