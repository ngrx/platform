declare const ngDevMode: boolean;

export function deepFreeze<T>(target: T): T {
  Object.freeze(target);

  const targetIsFunction = typeof target === 'function';

  Object.getOwnPropertyNames(target).forEach((prop) => {
    // Ignore Ivy properties, ref: https://github.com/ngrx/platform/issues/2109#issuecomment-582689060
    if (prop.startsWith('ɵ')) {
      return;
    }

    if (
      hasOwnProperty(target, prop) &&
      (targetIsFunction
        ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments'
        : true)
    ) {
      const propValue = target[prop];

      if (
        (isObjectLike(propValue) || typeof propValue === 'function') &&
        !Object.isFrozen(propValue)
      ) {
        deepFreeze(propValue);
      }
    }
  });

  return target;
}

export function freezeInDevMode<T>(target: T): T {
  return ngDevMode ? deepFreeze(target) : target;
}

function hasOwnProperty(
  target: unknown,
  propertyName: string
): target is { [propertyName: string]: unknown } {
  return isObjectLike(target)
    ? Object.prototype.hasOwnProperty.call(target, propertyName)
    : false;
}

function isObjectLike(target: unknown): target is object {
  return typeof target === 'object' && target !== null;
}
