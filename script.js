const getParentHeight = elem => {
  const height = {};
  const parent = elem.parentElement;
  if (getComputedStyle(elem).display === 'none') {
    height.before = parent.offsetHeight + getElementHeight(elem);
  } else {
    height.before = parent.offsetHeight;
  }
  elem.style.setProperty('display', 'none');
  height.after = parent.offsetHeight;
  elem.style.removeProperty('display');

  return height;
};

const getElementVertMargin = element => {
  const getNumericValue = margin => {
    return +margin.match(/[\d.]+/);
  };

  let marginSize;
  const margins = getComputedStyle(element).margin.split(' ');
  const arrLength = margins.length;
  if ((arrLength === 1 || arrLength === 2) && margins[0] !== '0px') {
    marginSize = 2 * getNumericValue(margins[0]);
  } else if (arrLength === 3 || arrLength === 4) {
    marginSize = getNumericValue(margins[0]);
    marginSize += getNumericValue(margins[2]);
  }

  return marginSize || 0;
};

const getElementHeight = element => {
  element.style.setProperty(
    'display',
    getComputedStyle(element).display === 'none' ? 'block' : ''
  );
  const height = element.offsetHeight;
  element.style.removeProperty('display');

  return height + getElementVertMargin(element);
};

const setMaxHeight = (elem, height) => {
  elem.style.setProperty('max-height', height);
};

const removeMaxHeight = elem => elem.style.removeProperty('max-height');

const getToggleElement = eventTarget => {
  let toggleBtn = eventTarget;
  while (!toggleBtn.getAttribute('toggle-element')) {
    /** bubbles up untill the attribute is found */
    toggleBtn = toggleBtn.parentElement;
  }

  return toggleBtn.getAttribute('toggle-element');
};

const classNames = {
  collapsed: 'js-anim--collapsed',
  collapse: 'js-anim--collapse',
  expand: 'js-anim--expand',
};

const parentMxHgt = {
  collapse: { initial: 'before', final: 'after' },
  expand: { initial: 'after', final: 'before' },
};

const oppositeAction = {
  collapse: 'expand',
  expand: 'collapse',
};

const setParentMaxHeight = args => {
  const { reset = false, element, parentHeight, action } = args;
  setMaxHeight(
    element.parentElement,
    `${parentHeight[parentMxHgt[action][reset ? 'final' : 'initial']]}px`
  );
};

const toggle = (element, action) => {
  const parentHeight = getParentHeight(element);

  setParentMaxHeight({ element, parentHeight, action });
  element.classList.add(classNames[action]);
  element.classList.remove(classNames[oppositeAction[action]]);

  setTimeout(() => {
    setParentMaxHeight({ reset: true, element, parentHeight, action });
    if (action === 'expand') {
      element.classList.remove(classNames.collapsed);
    }
  }, 150);

  setTimeout(() => {
    if (action === 'collapse') {
      element.classList.add(classNames.collapsed);
    }
    removeMaxHeight(element.parentElement);
  }, 650);
};

const toggleElement = e => {
  document
    .querySelectorAll(`.${getToggleElement(e.target)}`)
    .forEach(element => {
      const classList = [...element.classList];
      const action = classList.find(c => c === classNames.collapsed)
        ? 'expand'
        : 'collapse';

      toggle(element, action);
    });
};

document.querySelectorAll('.js-anim--toggle-btn').forEach(btn => {
  btn.addEventListener('click', toggleElement);

  document
    .querySelectorAll(`.${getToggleElement(btn)}`)
    .forEach(el => el.parentElement.classList.add('js-anim--mxhgt-transition'));
});

// export default toggleElement;
