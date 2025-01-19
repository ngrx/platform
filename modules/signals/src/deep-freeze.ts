declare const ngDevMode: boolean;

export function deepFreeze<T extends object>(target: T): T {
  Object.freeze(target);

  const targetIsFunction = typeof target === 'function';

  Reflect.ownKeys(target).forEach((prop) => {
    if (String(prop).startsWith('ɵ')) {
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

export function freezeInDevMode<T extends object>(target: T): T {
  return ngDevMode ? deepFreeze(target) : target;
}

function hasOwnProperty(
  target: unknown,
  propertyName: string | symbol
): target is { [propertyName: string | symbol]: unknown } {
  return isObjectLike(target)
    ? Object.prototype.hasOwnProperty.call(target, propertyName)
    : false;
}

function isObjectLike(target: unknown): target is object {
  return typeof target === 'object' && target !== null;
}
