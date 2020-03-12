import { getGlobalThis } from './get-global-this';
export function getRequestAnimationFrameInAngular() {
  const globalThis = getGlobalThis();
  // '__zone_symbol__requestAnimationFrame' reference to the
  // NOT PATCHED requestAnimationFrame of the browser
  if (
    '__zone_symbol__requestAnimationFrame' in globalThis &&
    globalThis.__zone_symbol__requestAnimationFrame !== undefined
  ) {
    return globalThis.__zone_symbol__requestAnimationFrame;
  }
  // If function is executed on server or in zone-less mode return normal animationFrameRef
  if (
    'requestAnimationFrame' in globalThis &&
    globalThis.requestAnimationFrame !== undefined
  ) {
    return globalThis.requestAnimationFrame;
  }
  // if on server (SSR) return empty function
  return (callback: Function) => {
    callback();
    // Return a random number to fake the asyncId of async tasks
    return Math.random();
  };
}
