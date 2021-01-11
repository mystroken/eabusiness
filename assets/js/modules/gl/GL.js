/* eslint-disable no-use-before-define */
import { WebGLRenderer } from 'three';
import Raf from '@mystroken/g/Raf';
import forEachIn from '@mystroken/g/forEachIn';

/**
 * Resize WebGL Renderer
 * @param {WebGLRenderer} renderer
 * @return boolean
 */
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(window.devicePixelRatio);
  }
  return needResize;
}

/**
 * Initialize the module.
 * @param {{canvas: HTMLElement}} params
 */
export default function initializeGL(params) {
  const sceneElements = [];
  const rAF = new Raf(render);
  const { canvas } = params;
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  function render() {
    resizeRendererToDisplaySize(renderer);

    renderer.setScissorTest(false);
    renderer.clear(false, true);
    renderer.setScissorTest(true);

    // Render scenes.
    forEachIn(sceneElements)(scene => {
      if (scene.needRender()) scene.render(renderer, canvas.clientWidth, canvas.clientHeight);
    });
  }

  /**
   * Turn on the module.
   */
  function turnOn() {
    // Start running the update loop.
    rAF.run();
  }

  /**
   * Turn off the module.
   */
  function turnOff() {
    // Stop the loop.
    rAF.stop();
  }

  /**
   * Add a scene to render.
   * @param {{needRender: Function, render: Function}} scene
   */
  function add(scene) {
    sceneElements.push(scene);
  }

  /**
   * Add a scene (at the top) to render.
   * @param {{needRender: Function, render: Function}} scene
   */
  function prepend(scene) {
    sceneElements.unshift(scene);
  }

  /**
   * Remove a scene from rendering loop.
   * @param {{needRender: Function, render: Function}} scene
   */
  function remove(scene) {
    sceneElements.splice(scene, 1);
  }

  return {
    renderer,
    on: turnOn,
    off: turnOff,
    add,
    prepend,
    remove,
  };
}
