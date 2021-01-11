/* eslint-disable no-return-assign */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import animate from '@mystroken/g/animate';
import forEachIn from '@mystroken/g/forEachIn';
import AbstractMenuAnimator from './AbstractMenuAnimator';

export default class TouchableMenuAnimator extends AbstractMenuAnimator {
  constructor(params) {
    super();
    this.e = params.e;
  }

  /**
   * Initialize the animation timeline.
   */
  init() {
    const {
      textClose,
      textContact,
      menuLinks,
      menuBackground,
      shapes2D,
      shapes3D,
    } = this.e;

    // 2D SHAPES ANIMATIONS.
    //----
    // 2D Shape background opacity.
    const shape2dBackgroundShow = animate({ el: menuBackground, e: 'o6', d: 1200, p: { opacity: 1 } });
    const shape2dBackgroundHide = animate({ el: menuBackground, e: 'linear', d: 400, p: { opacity: 0 } });
    // 2D Shape circle drawn.
    const shape2dCircleDraw = animate({ el: shapes2D.a.c, d: 800, e: 'io6', p: { d: 1 } });
    const shape2dCircleUndraw = animate({ el: shapes2D.a.c, d: 200, e: 'o6', p: { d: 0 } });

    // DOM ANIMATIONS.
    //----
    // Text animations.
    const txtAnimParams = { e: 'o6', d: 1500 };
    const textShow = animate({ el: [textClose, textContact], delay: i => i * 150, p: { y: [120, 0] }, ...txtAnimParams });
    const textHide = animate({ el: [textClose, textContact], p: { y: 120 }, ...txtAnimParams });
    // Menu
    const menuLinksArray = Array.from(menuLinks);
    forEachIn(menuLinksArray)(menuLink => menuLink.style.transform = 'translate3d(0,120%,0)');
    const menuLinksShow = animate({ el: menuLinksArray, p: { y: 0 }, ...txtAnimParams });
    const menuLinksHide = animate({ el: menuLinksArray, p: { y: 120 }, ...txtAnimParams });

    // 3D SHAPES ANIMATIONS.
    const shapes3dGlobeShow = animate({ el: shapes3D.v, e: 'linear', d: 600, p: { opacity: 1 } });
    const shapes3dGlobeHide = animate({ el: shapes3D.v, e: 'linear', d: 200, p: { opacity: 0 } });

    this.entranceTimeline
      .add(shape2dBackgroundShow)
      .add(shape2dCircleDraw, 0)
      .add(shapes3dGlobeShow, '-=500')
      .add(menuLinksShow, 150)
      .add(textShow, `-=${menuLinksShow.duration + 200}`);

    this.exitTimeline
      .add(shape2dCircleUndraw)
      .add(shapes3dGlobeHide, 0)
      .add(textHide, 0)
      .add(menuLinksHide, 0)
      .add(shape2dBackgroundHide, 60);

    super.init();
  }
}
