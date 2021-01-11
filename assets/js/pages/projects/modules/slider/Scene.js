/* eslint-disable no-return-assign */
/* eslint-disable max-len */
import {
  Scene,
  PerspectiveCamera,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three';
import forEachIn from '@mystroken/g/forEachIn';

/**
 * Translate DOM coordinate to WebGL coordinate.
 * @param {Number} y The DOM y-axis coordinate.
 * @returns {Number}
 */
function getWebGLCoordinateFromDOM(y) {
  return -1 * y;
}

export default function initializeScene(params) {
  // Create couple of variables
  // in order to control meshes externally.
  const variables = {
    opacity: 1,
    needRender: true,
    y: 0,
  };

  const { slides, viewport } = params;

  // Create a scene.
  const scene = new Scene();

  // Create a camera.
  // Make geometries use screen unit.
  const perspective = 100;
  const fov = (180 * (2 * Math.atan(viewport.height / 2 / perspective))) / Math.PI;
  const camera = new PerspectiveCamera(fov, 2, 1, 2000);
  camera.position.set(0, 0, perspective);
  // camera.rotateZ(-1 * (Math.PI / 4));
  // camera.rotateZ(-1 * (Math.PI / 6));

  // Add meshes to the scene.
  const planes = slides.map(slide => {
    const geometry = new PlaneGeometry(1, 1);
    const material = new MeshBasicMaterial({ map: slide.texture });
    const plane = new Mesh(geometry, material);
    scene.add(plane);

    return plane;
  });

  /**
   * @returns boolean
   */
  function needRender() {
    return variables.needRender;
  }

  /**
   *
   * @param {WebGLRenderer} renderer
   */
  function render(renderer) {
    const {
      width: viewportWidth,
      height: viewportHeight,
    } = viewport;
    camera.aspect = viewportWidth / viewportHeight;
    camera.updateProjectionMatrix();

    forEachIn(planes)((plane, index) => {
      const {
        y,
        width,
        height,
      } = slides[index].bounds;
      plane.position.y = getWebGLCoordinateFromDOM(y);
      plane.scale.set(width, height, 1);
    });

    renderer.setScissor(0, 0, viewportWidth, viewportHeight);
    renderer.setViewport(0, 0, viewportWidth, viewportHeight);
    renderer.render(scene, camera);
  }

  return {
    v: variables,
    scene,
    camera,
    render,
    needRender,
  };
}
