/* eslint-disable max-len */
import {
  Scene,
  PerspectiveCamera,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
} from 'three';

// Create couple of variables
// in order to control meshes externally.
const variables = {
  opacity: 0,
  needRender: false,
};

const containerElement = document.querySelector('#m-s-g-globe');

// Create a scene.
const scene = new Scene();

// Create a camera.
const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 5;
const camera = new PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 1, 2);
camera.lookAt(0, 0, 0);

// Add meshes to the scene.
const radius = 0.85;
const segments = 18;
const rings = 18;
const geometry = new SphereGeometry(radius, segments, rings);
const material = new MeshBasicMaterial({ wireframe: true, color: 0xA3A19F, transparent: true });
const cube = new Mesh(geometry, material);
scene.add(cube);

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
  cube.rotation.y = performance.now() / 1000;
  material.opacity = variables.opacity;

  // get the viewport relative position of this element
  const {
    left,
    bottom,
    width,
    height,
  } = containerElement.getBoundingClientRect();

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
  renderer.setScissor(left, positiveYUpBottom, width, height);
  renderer.setViewport(left, positiveYUpBottom, width, height);
  renderer.render(scene, camera);
}

export default {
  v: variables,
  scene,
  camera,
  render,
  needRender,
};
