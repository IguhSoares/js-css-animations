import { init, animate, preset, isEnabled } from './animate.js';
import { VISIBILITY_ANIMS_ID, MOTION_ANIMS_ID } from './globals.js';

const selectElement = (selector, quantity = {}) => {
  const { all } = quantity;
  const el =
    selector instanceof HTMLElement
      ? selector
      : typeof selector === 'string'
      ? all
        ? document.querySelectorAll(selector)
        : document.querySelector(selector)
      : null;
  if (!el)
    throw new ReferenceError(
      `Invalid element: '${selector}' Expected HTMLElement or a valid element selector`
    );
  return el;
};

const getTargets = element => {
  const elements = selectElement(element, { all: true });
  return elements instanceof NodeList ? elements : [elements];
};

const toggle = (selector, animA, animB, opts = {}) => {
  const { duration, delay, staggerDelay, timingFunction, blur, rotationDeg } =
    opts;
  const args = {
    duration,
    delay,
    staggerDelay,
    timingFunction,
    blur,
    rotationDeg,
  };

  const element = selectElement(selector);
  const currentAnim = element.getAttribute('js-css-animation--current');
  const newAnim =
    !currentAnim || ![animA, animB].includes(currentAnim)
      ? animA
      : currentAnim === animA
      ? animB
      : animA;
  const animType =
    MOTION_ANIMS_ID[newAnim] !== undefined ? 'motion' : 'visibility';
  element.setAttribute('js-css-animation--current', newAnim);
  if (animType === 'visibility') {
    checkVisibility(element, 'hidden')
      ? jsCssAnimations.show[newAnim](selector, args)
      : jsCssAnimations.hide[newAnim](selector, args);
  } else if (animType === 'motion') {
    jsCssAnimations[newAnim](selector, args);
  }
};

const animationFunctions = (function () {
  const handlers = {};
  ['show', 'hide', 'move'].forEach(action => {
    const { animIds, animType } =
      action === 'move'
        ? { animIds: MOTION_ANIMS_ID, animType: 'motion' }
        : { animIds: VISIBILITY_ANIMS_ID, animType: 'visibility' };

    for (const [name, id] of Object.entries(animIds)) {
      const handler = (target, opts = {}) => {
        const {
          start,
          complete,
          hide,
          overflowHidden,
          staggerDelay,
          widthTransition = true,
          heightTransition = true,
        } = opts;

        getTargets(target).forEach((element, i) => {
          opts.animType = animType;
          opts.queryIndex = i;
          preset(element, {
            widthTransition,
            heightTransition,
            opts,
            animationId: id,
          });

          if (isEnabled(element))
            animate(element, action, id, {
              animType,
              start,
              complete,
              widthTransition,
              heightTransition,
              hide,
              overflowHidden,
              staggerDelay,
            });
        });
      };

      if (action === 'move') {
        handlers[name] = handler;
      } else {
        if (!handlers[action]) handlers[action] = {};
        handlers[action][name] = handler;
      }
    }
  });
  return handlers;
})();

const eventBoundAnimations = (() => {
  const animations = {};
  [VISIBILITY_ANIMS_ID, MOTION_ANIMS_ID].forEach(animIds => {
    const animType = animIds === VISIBILITY_ANIMS_ID ? 'visibility' : 'motion';
    Object.keys(animIds).forEach(animName => {
      animations[animName] = opts =>
        init(animIds[animName], { animType, ...opts });
    });
  });
  return animations;
})();

const checkRotation = selector => {
  const el = document.querySelector(selector);
  const transform = getComputedStyle(el).transform;
  return transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)';
};

const checkVisibility = (selector, mode) => {
  const el = selectElement(selector);
  let result;
  if (mode === 'hidden') {
    result =
      getComputedStyle(el).visibility === 'hidden' ||
      getComputedStyle(el).display === 'none';
  } else if (mode === 'visible') {
    result = !checkVisibility(selector, 'hidden');
  }
  return result;
};

const verifyAnimationName = {
  get(animations, name) {
    if (!(name in animations))
      throw new ReferenceError(`${name} is not a valid animation`);
    return animations[name];
  },
};

const jsCssAnimations = (function () {
  const eventAnimations = new Proxy(eventBoundAnimations, verifyAnimationName);
  const showVisibilityAnim = new Proxy(
    animationFunctions.show,
    verifyAnimationName
  );
  const hideVisibilityAnim = new Proxy(
    animationFunctions.hide,
    verifyAnimationName
  );
  const animationsHandler = Object.freeze({
    init: eventAnimations,
    ...animationFunctions,
    show: showVisibilityAnim,
    hide: hideVisibilityAnim,
    toggle: toggle,
    isRotated: checkRotation,
    isVisible: selector => checkVisibility(selector, 'visible'),
    isHidden: selector => checkVisibility(selector, 'hidden'),
  });

  return new Proxy(animationsHandler, verifyAnimationName);
})();

export default jsCssAnimations;
