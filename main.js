import jsCssAnimations from './js-css-animations/js-css-animations.js';

jsCssAnimations.init.slideUp({
  toggleBtn: '.btn--slide-up',
  staggerDelay: 500,
  duration: '1s',
  start: () => {
    jsCssAnimations.toggle('#anchor img', 'rotateDownCCW', 'rotateUp');
  },
});

jsCssAnimations.init.slideRight({
  toggleBtn: '.btn--slide-right',
  start: () => {
    jsCssAnimations.toggle('#anchor2 img', 'rotateRight', 'rotateUp');
  },
});

jsCssAnimations.init.slideDown({
  toggleBtn: '.btn--slide-down',
  delay: '1.5s',
  start: () => {
    jsCssAnimations.toggle('img', 'rotateDownCCW', 'rotateUp', {
      delay: '1.5s',
    });
    document.querySelector('.delay-counter').innerText = '1.5 seconds Delay';
    jsCssAnimations.show.collapse('.delay-counter', {
      hide: true,
    });
  },
  complete: () => {
    jsCssAnimations.hide.fade('.delay-counter', {
      hide: true,
      complete: () => {
        document.querySelector('.delay-counter').innerText = '';
      },
    });
  },
});

jsCssAnimations.init.slideLeft({
  toggleBtn: '.btn--slide-left',
  staggerDelay: 500,
  start: () => {
    jsCssAnimations.toggle('img', 'slideLeft', 'slideLeft', {
      staggerDelay: 400,
    });
  },
});

jsCssAnimations.init.collapse({
  toggleBtn: '.collapse-expand--btn',
  targetSelector: '.collapse-expand--p',
});

jsCssAnimations.init.collapse({
  toggleBtn: '.collapse-expand--btn__mult',
  targetSelector: '.collapse-expand--p__mult',
  staggerDelay: 400,
  hide: true,
});

jsCssAnimations.init.fade({
  toggleBtn: '.fade--btn',
  blur: '2px',
  hide: true,
  heightTransition: false,
  widthTransition: false,
  // start: () => {
  //   window.scroll({ top: document.documentElement.scrollHeight });
  // },
});

document.querySelector('.rotation--btn').addEventListener('click', () => {
  const input = document.getElementById('rotation-angle');
  const msgArea = document.querySelector('.rotation--input-error');
  const angle = input.value;
  if (input.validity.patternMismatch) {
    jsCssAnimations.hide.fade(input, {
      duration: 200,
      hide: true,
      complete: () => {
        msgArea.innerText = 'Type in a number (e.g.: 10, -22.5, 270)';
        setTimeout(() => {
          jsCssAnimations.show.fade('#rotation-angle', {
            duration: 200,
            hide: true,
            complete: () => {
              input.value = '';
              setTimeout(() => {
                msgArea.innerText = '';
              }, 2500);
            },
          });
        }, 0);
      },
    });
  }

  jsCssAnimations.rotate('.rotation-area', {
    rotationDeg: `${angle}deg`,
    duration: '2s',
    timingFunction: 'ease-in-out',
  });
});

jsCssAnimations.show.fade('#anchor img', {
  iteration: 'infinite',
  duration: '1s',
  direction: 'alternate',
});
