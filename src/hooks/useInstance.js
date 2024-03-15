import { useRef } from "react";

/**
 * @param {Function} Constructor - The constructor prototype
 * @param {...*} params - The constructor params
 * @returns {*} - The instanced constrcutor
 */
export default function useInstance(Constructor, ...args) {
  const instance = useRef(null);

  if (typeof Constructor !== "function" || !Constructor.prototype) {
    return {};
  }

  if (instance.current === null) {
    instance.current = new Constructor(...args);
  }

  return instance.current;
}
