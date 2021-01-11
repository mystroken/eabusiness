/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import Timeline from '@mystroken/g/Timeline';

export default class AbstractMenuAnimator {
  constructor() {
    // Animator state.
    this.initialized = false;
    this.entranceTimeline = new Timeline();
    this.exitTimeline = new Timeline();
  }

  /**
   * Initialize the animator.
   * Prepares elements to be animated.
   */
  init() {
    this.initialized = true;
  }

  /**
   * @returns Promise
   */
  runEnter() {
    this.exitTimeline.stop();
    return new Promise(resolve => {
      this.entranceTimeline.play({ cb: resolve });
    });
  }

  /**
   * @returns Promise
   */
  runExit() {
    this.entranceTimeline.stop();
    return new Promise(resolve => {
      this.exitTimeline.play({ cb: resolve });
    });
  }
}
