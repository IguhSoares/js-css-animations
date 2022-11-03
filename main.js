import initAnimations from './toggle.js';

initAnimations('expand-collapse');
initAnimations('expand-collapse', {
  toggleBtn: '.my-custom-btn',
  cursor: 'default',
  duration: '1500ms',
  timingFunction: 'ease-in-out',
});
