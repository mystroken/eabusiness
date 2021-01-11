/* eslint-disable no-return-assign */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import animate from '@mystroken/g/animate';
import forEachIn from '@mystroken/g/forEachIn';
import BezierEasing from 'bezier-easing';
import AbstractMenuAnimator from './AbstractMenuAnimator';

export default class ExplorableMenuAnimator extends AbstractMenuAnimator {
  constructor(params) {
    super();
    this.e = params.e;
  }

  /**
   * Initialize the animation timeline.
   */
  init() {
    const {
      interaction,
      textBrand,
      textClose,
      textContact,
      textInfos,
      menuContainer,
      menuLinks,
      menuInfoLine,
      menuInfoLabel,
      menuBackground,
      shapes2D,
      shapes3D,
      windowWidth,
    } = this.e;

    // const menuLinks = Array.prototype.slice.call(document.querySelectorAll('#menu .menu-link'));
    const customEasing = BezierEasing(0.89, 0, 0.45, 1);

    // 2D SHAPES ANIMATIONS.
    //----
    // 2D Shape background opacity.
    const shape2dBackgroundShow = animate({ el: menuBackground, e: 'o6', d: 1200, p: { opacity: 1 } });
    const shape2dBackgroundHide = animate({ el: menuBackground, e: 'linear', d: 400, p: { opacity: 0 } });
    // 2D Shape circle drawn.
    const shape2dCircleDraw = animate({ el: shapes2D.a.c, d: 1000, e: t => customEasing(t), p: { d: 1 } });
    const shape2dCircleUndraw = animate({ el: shapes2D.a.c, d: 200, e: 'o6', p: { d: 0 } });

    // DOM ANIMATIONS.
    //----
    // Text animations.
    const txtAnimParams = { e: 'o6', d: 1500 };
    const textBrandShow = animate({ el: textBrand, p: { y: [120, 0] }, ...txtAnimParams });
    const textOtherShow = animate({ el: [textClose, textContact, textInfos], delay: i => i * 150, p: { y: [120, 0] }, ...txtAnimParams });
    const textHide = animate({ el: [textBrand, textClose, textContact, textInfos], p: { y: 120 }, ...txtAnimParams });
    // Menu elements.
    const menuLinksArray = Array.prototype.slice.call(menuLinks);
    this.menuContainerShow = animate({
      el: menuContainer,
      d: 2000,
      e: t => customEasing(t),
      p: { x: [windowWidth, interaction.explorer.positionAt(0, 0).x, 'px'] },
      update: p => {
        if (p >= 0.1 && p <= 0.3) forEachIn(menuLinksArray)(link => link.style.transform = 'translate3d(0,0,0)');
      },
    });
    const menuLinksHide = animate({ el: menuLinksArray, p: { y: 120 }, d: 400 });
    // Menu info
    const menuInfoLineShow = animate({ el: menuInfoLine, p: { scaleX: [0, 1] } });
    const menuInfoLineHide = animate({ el: menuInfoLine, d: 200, p: { scaleX: [1, 0] } });
    const menuInfoLabelShow = animate({ el: menuInfoLabel, p: { y: [120, 0] } });
    const menuInfoLabelHide = animate({ el: menuInfoLabel, d: 200, p: { y: [0, 120] } });

    // 3D SHAPES ANIMATIONS.
    const shapes3dGlobeShow = animate({ el: shapes3D.v, e: 'linear', d: 600, p: { opacity: 1 } });
    const shapes3dGlobeHide = animate({ el: shapes3D.v, e: 'linear', d: 200, p: { opacity: 0 } });

    this.entranceTimeline
      .add(shape2dBackgroundShow)
      .add(textBrandShow, 0)
      .add(this.menuContainerShow, 300)
      .add(menuInfoLineShow)
      .add(menuInfoLabelShow)
      .add(shape2dCircleDraw, 1000)
      .add(textOtherShow, '-=600')
      .add(shapes3dGlobeShow, 1500);

    this.exitTimeline
      .add(shape2dCircleUndraw)
      .add(shape2dBackgroundHide, 0)
      .add(shapes3dGlobeHide, 0)
      .add(textHide, 0)
      .add(menuLinksHide, 0)
      .add(menuInfoLineHide, 0)
      .add(menuInfoLabelHide, 0);

    super.init();
  }

  /**
   * @returns Promise
   */
  runEnter() {
    this.exitTimeline.stop();
    return new Promise(resolve => {
      this.entranceTimeline.play({
        update: (p, e) => {
          if (e >= (this.menuContainerShow.duration + 300)) resolve();
        },
      });
    });
  }
}
