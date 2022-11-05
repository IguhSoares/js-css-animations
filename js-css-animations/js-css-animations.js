import {
  getParentMeasures,
  setParentMaxMeasures,
  removeDimensionMax,
} from './measurements.js';

const animationsId = {
  collapse: 0,
  slideUp: 1,
  slideDown: 2,
  slideLeft: 3,
  slideRight: 4,
};

const propertyNames = {
  duration: '--js-css-animation--duration',
  timingFunction: '--js-css-animation--timing-function',
  cursor: '--js-css-animation--cursor',
};

const classNames = {
  dimensionsTransitions: 'js-anim--dimensions-transitions',
  heightTransition: 'js-anim--height-transition',
  widthTransition: 'js-anim--width-transition',
  toggleBtn: 'js-anim--toggle-btn',
  btnCursor: 'js-anim--btn-cursor',
  collapsed: 'js-anim--collapsed',
  hide: [
    'js-anim--collapse',
    'js-anim--slide-up',
    'js-anim--slide-down',
    'js-anim--slide-left',
    'js-anim--slide-right',
  ],
  show: [
    'js-anim--expand',
    'js-anim--slide-up__back',
    'js-anim--slide-down__back',
    'js-anim--slide-left__back',
    'js-anim--slide-right__back',
  ],
};

const getCustomProperties = () => ['duration', 'timingFunction'];

const getRootProperty = property => {
  return getComputedStyle(document.documentElement).getPropertyValue(
    propertyNames[property]
  );
};

const setParentCssProperties = element => {
  let currentProp;
  getCustomProperties().forEach(prop => {
    currentProp = getComputedStyle(element).getPropertyValue(
      propertyNames[prop]
    );

    if (currentProp !== getRootProperty(prop)) {
      element.parentElement.style.setProperty(propertyNames[prop], currentProp);
    }
  });
};

const removeParentCssProperties = element => {
  getCustomProperties().forEach(prop => {
    element.parentElement.style.removeProperty(propertyNames[prop]);
  });
};

const setCssProperty = (element, property, value) => {
  element.style.setProperty(propertyNames[property], value);
};

const updateCssProperties = (element, opts) => {
  getCustomProperties().forEach(prop => {
    if (typeof opts[prop] === 'string') {
      setCssProperty(element, prop, opts[prop]);
    }
  });
};

const getTransitions = element => {
  const currTransition = getComputedStyle(element).transition;
  return currTransition !== getDefaultComputedStyle(element).transition
    ? currTransition
    : '';
};

const getClassTransition = className => {
  return [
    ...[...document.styleSheets].find(ss => ss.href.match(/js-animations\.css/))
      .cssRules,
  ].find(r => r.cssText.match(`\\.${className}`)).style.transition;
};

const appendTransition = (element, className, currTransition) => {
  const classTransition = getClassTransition(className);
  if (classTransition) {
    element.style.setProperty(
      'transition',
      `${classTransition}, ${currTransition}`
    );
  }
};

const setDimensionsTransitions = (element, wTransit, hTransit) => {
  const currTransition = getTransitions(element);
  let className;

  if (wTransit && hTransit) {
    className = classNames.dimensionsTransitions;
  } else if (wTransit) {
    className = classNames.widthTransition;
  } else if (hTransit) {
    className = classNames.heightTransition;
  }

  if (className) element.classList.add(className);
  if (currTransition) appendTransition(element, className, currTransition);
};

const getToggleSelector = eventTarget => {
  let toggleBtn = eventTarget;
  while (toggleBtn && !toggleBtn.getAttribute('toggle-selector')) {
    /** bubbles up untill the attribute is found */
    toggleBtn = toggleBtn.parentElement;
  }

  if (!toggleBtn)
    throw new ReferenceError('toggle-selector attribute not found');

  return toggleBtn.getAttribute('toggle-selector');
};

const callbackTracker = {
  executing: {},
};
Object.freeze(callbackTracker);

const animate = (element, action, id, opts = {}) => {
  element.setAttribute('disabled', 'true');
  const { complete, start, toggleBtn } = opts;
  const duration = Number(
    getComputedStyle(element)
      .getPropertyValue(propertyNames.duration)
      .match(/\d+/)
  );

  setParentCssProperties(element);

  const oppositeAction = {
    hide: 'show',
    show: 'hide',
  };
  const parentMeasures = getParentMeasures(element);
  setParentMaxMeasures({ element, parentMeasures, action });

  if (typeof start === 'function' && !callbackTracker.executing[toggleBtn]) {
    start();
  }

  element.classList.add(classNames[action][id]);
  element.classList.remove(classNames[oppositeAction[action]][id]);

  setTimeout(() => {
    setParentMaxMeasures({
      parentState: 'final',
      element,
      parentMeasures,
      action,
    });
    if (action === 'show') {
      element.classList.remove(classNames.collapsed);
    }
  }, 0);

  setTimeout(() => {
    if (action === 'hide') {
      element.classList.add(classNames.collapsed);
    }
    removeDimensionMax(element.parentElement, 'height');
    removeDimensionMax(element.parentElement, 'width');
    setTimeout(() => element.removeAttribute('disabled'), 100);
    removeParentCssProperties(element);

    if (
      typeof complete === 'function' &&
      !callbackTracker.executing[toggleBtn]
    ) {
      complete();
    }

    delete callbackTracker.executing[toggleBtn];
  }, duration);

  if (!callbackTracker.executing[toggleBtn])
    callbackTracker.executing[toggleBtn] = true;
};

const eventHandler = (triggerBtn, id, opts = {}) => {
  document.querySelectorAll(getToggleSelector(triggerBtn)).forEach(element => {
    const classList = [...element.classList];
    const action = classList.find(c => c === classNames.collapsed)
      ? 'show'
      : 'hide';

    if (!element.getAttribute('disabled')) animate(element, action, id, opts);
  });
};

const init = (animationId, opts = {}) => {
  const {
    toggleBtn = `.${classNames.toggleBtn}`,
    toggleSelector,
    cursor,
    widthTransition = true,
    heightTransition = true,
    start,
    complete,
  } = opts;

  document.querySelectorAll(toggleBtn).forEach(btn => {
    btn.classList.add(classNames.btnCursor);
    if (typeof cursor === 'string') {
      setCssProperty(btn, 'cursor', cursor);
    }
    if (typeof toggleSelector === 'string') {
      btn.setAttribute('toggle-selector', toggleSelector);
    }

    document.querySelectorAll(getToggleSelector(btn)).forEach(el => {
      updateCssProperties(el, opts);
      setDimensionsTransitions(
        el.parentElement,
        widthTransition,
        heightTransition
      );
    });

    btn.addEventListener('click', e => {
      e.stopPropagation();
      eventHandler(e.target, animationId, { start, complete, toggleBtn });
    });
  });
};

const initAnimations = (type, opts) => {
  init(animationsId[type], opts);
};

export default initAnimations;
