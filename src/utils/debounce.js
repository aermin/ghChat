export default function debounce(func, threshold = 500, immediate = false) {
  if (typeof func !== 'function') {
    throw new Error('First argument of debounce function should be a function');
  }
  let timer = null;
  return function debounced(...args) {
    const context = this;
    const callNow = immediate && !timer;
    const later = () => {
      timer = null;
      if (!immediate) func.apply(context, args);
    };
    console.log('please wait');
    clearTimeout(timer);
    timer = setTimeout(later, threshold);
    if (callNow) func.apply(context, args);
  };
}
