export const debounce = (func, delay) => {
  let debounceHandler;
  return function () {
    const context = this;
    clearTimeout(debounceHandler);
    debounceHandler = setTimeout(() => func.apply(context, arguments), delay);
  };
};

export const throttle = (func, delay) => {
  let prev = 0;
  return (...args) => {
    const now = performance.now();
    if (now - prev > delay) {
      prev = now;
      return func(...args);
    }
  };
};

export const throttleRAF = (callback) => {
  let requestId = null;
  let lastArgs;

  const later = (context) => () => {
    requestId = null;
    callback.apply(context, lastArgs);
  };

  const throttled = function (...args) {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };

  throttled.cancel = () => {
    cancelAnimationFrame(requestId);
    requestId = null;
  };

  return throttled;
};
