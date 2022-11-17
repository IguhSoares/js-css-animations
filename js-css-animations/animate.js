import {
  MOTION_ANIMS_ID,
  PROPERTY_NAMES,
  CLASS_NAMES,
  CUSTOM_CSS_PROPERTIES,
} from './globals.js';

import { initParentResize, endParentResize } from './resize-parent.js';

import {
  removeInlineTransition,
  appendTransition,
  getCurrentTransition,
} from './transitions.js';

import { setParentMaxMeasures } from './measurements.js';

const CALLBACK_TRACKER = Object.freeze({
  executing: {},
});

const initCallBackTracker = triggerBtn => {
  if (!CALLBACK_TRACKER.executing[triggerBtn]) {
    CALLBACK_TRACKER.executing[triggerBtn] = {};
  }
};

export const removeCustomCssProperties = element => {
  CUSTOM_CSS_PROPERTIES.forEach(prop => {
    element.style.removeProperty(PROPERTY_NAMES[prop]);
  });
};

export const setCssProperty = (element, property, value) => {
  element.style.setProperty(PROPERTY_NAMES[property], value);
};

const updateCssProperties = (element, opts) => {
  removeCustomCssProperties(element);
  removeInlineTransition(element);
  CUSTOM_CSS_PROPERTIES.forEach(prop => {
    if (typeof opts[prop] === 'string' || typeof opts[prop] === 'number') {
      if (
        ['delay', 'duration'].includes(prop) &&
        typeof opts[prop] === 'number'
      ) {
        opts[prop] = `${opts[prop]}ms`;
      }
      setCssProperty(element, prop, opts[prop]);
    }
  });
};

const getTargetSelector = eventTarget => {
  let triggerBtn = eventTarget;
  while (triggerBtn && !triggerBtn.getAttribute('target-selector')) {
    /** bubbles up untill the attribute is found */
    triggerBtn = triggerBtn.parentElement;
  }

  if (!triggerBtn)
    throw new ReferenceError('target-selector attribute not found');

  return triggerBtn.getAttribute('target-selector');
};

const DURATION_REGEX = Object.freeze(new RegExp(/(\d?\.\d+|\d+)(ms|s)?/));

const getTimeInMs = value => {
  if (value === undefined) return 0;
  if (typeof value === 'number') return value;
  let match = value.match(DURATION_REGEX);
  return match.at(-1) === 's' ? Number(match[1]) * 1000 : Number(match[1]);
};

const getTotalAnimTime = element => {
  const total = {};
  ['duration', 'delay'].forEach(prop => {
    total[prop] = getTimeInMs(
      getComputedStyle(element).getPropertyValue(PROPERTY_NAMES[prop])
    );
  });
  return total;
};

const isVisibility = animType => animType === 'visibility';
const isMotion = animType => animType === 'motion';

const removeMotionCssClasses = element => {
  const className = [...element.classList].find(cl =>
    cl.match(/js\-anim\-\-rotate/)
  );
  element.classList.remove(className);
};

const disable = element => {
  element.setAttribute('js-anim--disabled', 'true');
};

const enable = element => {
  element.removeAttribute('js-anim--disabled');
};

const isEnabled = element =>
  !(element.getAttribute('js-anim--disabled') === 'true');

const targetsStack = {};

const hasIterationProp = element => {
  return (
    element.style
      .getPropertyValue(PROPERTY_NAMES.iteration)
      .match(/^(infinite|\d+)$/) !== null
  );
};

const handleVisibilityToggle = (element, args) => {
  if (args.dimension) setParentMaxMeasures(args);
  if (args.action === 'show') {
    args.keepSpace
      ? element.classList.remove(CLASS_NAMES.hidden)
      : element.classList.remove(CLASS_NAMES.collapsed);
  }
};

const endVisibilityToggle = (element, opts) => {
  if (opts.action === 'hide') {
    opts.keepSpace
      ? element.classList.add(CLASS_NAMES.hidden)
      : element.classList.add(CLASS_NAMES.collapsed);
  }
  if (opts.heightTransition || opts.widthTransition)
    endParentResize(element, opts);
};

const animate = (element, action, id, opts = {}) => {
  disable(element);
  const {
    animType,
    triggerBtn,
    start,
    complete,
    keepSpace,
    dimensionsTransition = keepSpace ? false : true,
    overflowHidden = true,
  } = opts;
  const { duration, delay } = getTotalAnimTime(element);
  const OPPOSITE_ACTION = Object.freeze({
    hide: 'show',
    show: 'hide',
    move: 'moveBack',
    moveBack: 'move',
  });
  let parentMeasures, dimension, currentTransition;
  const {
    widthTransition = dimensionsTransition,
    heightTransition = dimensionsTransition,
  } = opts;

  if (triggerBtn) {
    if (!targetsStack[triggerBtn]) targetsStack[triggerBtn] = [];
    targetsStack[triggerBtn].push(element);
  }

  if (isVisibility(animType) && (widthTransition || heightTransition)) {
    ({ parentMeasures, dimension } = initParentResize({
      element,
      action,
      widthTransition,
      heightTransition,
      overflowHidden,
    }));
  } else if (isMotion(animType)) {
    currentTransition = getCurrentTransition(element);
    removeMotionCssClasses(element);
  }

  if (typeof start === 'function') {
    if (triggerBtn && !CALLBACK_TRACKER.executing[triggerBtn]?.start) {
      initCallBackTracker(triggerBtn);
      CALLBACK_TRACKER.executing[triggerBtn].start = true;
      start();
    } else if (!triggerBtn) {
      start();
    }
  }

  element.classList.add(CLASS_NAMES[action][id]);
  element.classList.remove(CLASS_NAMES[OPPOSITE_ACTION[action]][id]);

  if (isVisibility(animType)) {
    setTimeout(() => {
      handleVisibilityToggle(element, {
        parentState: 'final',
        element,
        parentMeasures,
        action,
        dimension,
        keepSpace,
      });
    }, 0);
  } else if (isMotion(animType)) {
    if (currentTransition) {
      appendTransition(element, CLASS_NAMES[action][id], currentTransition);
    }
    if (action === 'move') element.classList.add(CLASS_NAMES.moved);
  }

  setTimeout(() => {
    if (isVisibility(animType)) {
      endVisibilityToggle(element, {
        action,
        keepSpace,
        widthTransition,
        heightTransition,
      });
      if (!hasIterationProp(element))
        element.classList.remove(CLASS_NAMES[action][id]);
    } else if (isMotion(animType) && action === 'moveBack') {
      element.classList.remove(CLASS_NAMES.moved);
    }

    if (typeof complete === 'function') {
      if (triggerBtn && !CALLBACK_TRACKER.executing[triggerBtn]?.complete) {
        initCallBackTracker(triggerBtn);
        CALLBACK_TRACKER.executing[triggerBtn].complete = true;
        complete();
      } else if (!triggerBtn) {
        complete();
      }
    }

    if (triggerBtn && opts.queryIndex === opts.totalTargets - 1) {
      opts.staggerDelay
        ? delete CALLBACK_TRACKER.executing[triggerBtn]
        : setTimeout(() => {
            delete CALLBACK_TRACKER.executing[triggerBtn];
          }, delay);
      targetsStack[triggerBtn].forEach(el => enable(el));
      targetsStack[triggerBtn] = [];
    } else if (!triggerBtn) {
      enable(element);
    }
  }, duration + delay);
};

const getAction = (element, animType) => {
  const classList = [...element.classList];
  return isVisibility(animType)
    ? classList.find(
        c => c === CLASS_NAMES.collapsed || c === CLASS_NAMES.hidden
      )
      ? 'show'
      : 'hide'
    : isMotion(animType)
    ? classList.includes(CLASS_NAMES.moved)
      ? 'moveBack'
      : 'move'
    : null;
};

const preset = (el, args) => {
  const { opts, animationId } = args;
  const { animType } = opts;
  if (
    !isMotion(animType) ||
    ![MOTION_ANIMS_ID.rotate, MOTION_ANIMS_ID.rotationLoop].includes(
      animationId
    )
  )
    opts.angle = undefined;

  updateCssProperties(el, opts);

  if (opts.staggerDelay) {
    const staggeredDelay =
      getTimeInMs(opts.delay) +
      getTimeInMs(opts.staggerDelay) * opts.queryIndex;
    setCssProperty(el, 'delay', `${staggeredDelay}ms`);
  }
};

const eventHandler = (el, animationId, opts) => {
  return e => {
    e.stopPropagation();

    const action = getAction(el, opts.animType);
    if (!action)
      throw new ReferenceError(
        `Can't find a valid action for this animation type`
      );

    preset(el, {
      animationId,
      opts,
    });

    if (isEnabled(el)) animate(el, action, animationId, opts);
  };
};

const init = (animationId, opts = {}) => {
  const {
    triggerBtn = `.${CLASS_NAMES.triggerBtn}`,
    targetSelector,
    cursor,
  } = opts;

  document.querySelectorAll(triggerBtn).forEach(btn => {
    btn.classList.add(CLASS_NAMES.btnCursor);
    if (typeof cursor === 'string') {
      setCssProperty(btn, 'cursor', cursor);
    }
    if (typeof targetSelector === 'string') {
      btn.setAttribute('target-selector', targetSelector);
    }

    document
      .querySelectorAll(getTargetSelector(btn))
      .forEach((el, i, queryList) => {
        btn.addEventListener(
          'click',
          eventHandler(el, animationId, {
            ...opts,
            totalTargets: queryList.length,
            queryIndex: i,
          })
        );
      });
  });
};

export { init, animate, preset, isEnabled };
