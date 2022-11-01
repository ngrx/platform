interface Constructor<ClassType> {
  new (...args: never[]): ClassType;
}

/**
 * A proxy that will have all function calls return another such proxy
 * recursively, & all properties will contain another proxy.
 */
export function constructRecursiveProxy(name: string) {
  // Proxy can be of any type.
  let applyValue: unknown = null;

  const target: any = () => ({});

  // Proxy can be of any type.
  return new Proxy(target, {
    get: (obj, prop) => {
      if (prop === Symbol.toPrimitive) {
        return () => '';
      }
      if (!(prop in obj)) {
        obj[prop] = constructRecursiveProxy(`${name}.${String(prop)}`);
      }
      return obj[prop];
    },
    apply: () => {
      if (!applyValue) {
        applyValue = constructRecursiveProxy(`${name}()`);
      }
      return applyValue;
    },
  });
}

/**
 * Given a function or constructor, returns an array of recursive proxies (as
 * described in {@see constructRecursiveProxy}) such that they can be provided
 * as arguments to the function.
 *
 * This allows us to avoid calling actual function implementations in order to
 * avoid executing their side effects.
 */
export function getProxyArgsForFunction(fn: Constructor<unknown> | ((...args: unknown[]) => unknown)) {
  // The function that we want to call can take any arbitrary number of
  // arguments.  We need to provide objects that can 'get' any property and
  // also have any methods called on them.
  const args = Array.from({ length: fn.length }).map((_arg, index) =>
    constructRecursiveProxy(String(index))
  );
  return args;
}

/**
 * Runs a provided function with the provided `this` object, using a magic
 * proxy for all the arguments.
 *
 * This helps to prevent actual side effects from occurring, although it
 * does not prevent them.
 */
export function callWithRecursiveProxies(
  fn: (...args: unknown[]) => unknown,
  self: unknown
): unknown {
  const args = getProxyArgsForFunction(fn);
  return fn.call(self, ...args);
}
