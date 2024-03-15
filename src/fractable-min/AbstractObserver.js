/**
 * Aims to serve as a execute-once raycast result handler.
 * @constructor
 * @observer
 */
export default function AbstractObserver() {
  /** @type {Map<String, Array<Function>>} handlers */
  const handlers = new Map();

  /**
   * @param {String} type
   * @param {function(Object3D):void } handler
   */
  this.subscribe = (type, handler) => {
    if (typeof handler === "function") {
      const current = handlers.get(type) || [];
      const moreHandlers = [...current, handler];
      handlers.set(type, moreHandlers);
    }
  };

  /**
   * @param {String} type
   * @param {function(Object3D):void } handler
   */
  this.unsubscribe = (type, handler) => {
    if (typeof handler === "function") {
      const current = handlers.get(type);
      const lessHandlers = current.filter((fn) => fn !== handler);
      handlers.set(type, lessHandlers);
    }
  };

  this.notify = (type, value) => {
    const currents = handlers.get(type);
    if (Array.isArray(currents)) {
      for (const handler of currents) {
        handler(value);
      }
    }
  };
}
