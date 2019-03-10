export function getUnserializable(
  target?: any,
  path: string[] = []
): false | { path: string[]; value: any } {
  // Guard against undefined and null, e.g. a reducer that returns undefined
  if ((isUndefined(target) || isNull(target)) && path.length === 0) {
    return {
      path: ['root'],
      value: target,
    };
  }

  const keys = Object.keys(target);
  return keys.reduce<false | { path: string[]; value: any }>((result, key) => {
    if (result) {
      return result;
    }

    const value = (target as any)[key];

    if (
      isUndefined(value) ||
      isNull(value) ||
      isNumber(value) ||
      isBoolean(value) ||
      isString(value) ||
      isArray(value)
    ) {
      return false;
    }

    if (isPlainObject(value)) {
      return getUnserializable(value, [...path, key]);
    }

    return {
      path: [...path, key],
      value,
    };
  }, false);
}

export function throwIfUnserializable(
  unserializable: false | { path: string[]; value: any },
  context: 'state' | 'action'
) {
  if (unserializable === false) {
    return;
  }

  const unserializablePath = unserializable.path.join('.');
  const error: any = new Error(
    `Detected unserializable ${context} at "${unserializablePath}"`
  );
  error.value = unserializable.value;
  error.unserializablePath = unserializablePath;
  throw error;
}

/**
 * Object Utilities
 */

export function isUndefined(target: any): target is undefined {
  return target === undefined;
}

export function isNull(target: any): target is null {
  return target === null;
}

export function isArray(target: any): target is Array<any> {
  return Array.isArray(target);
}

export function isString(target: any): target is string {
  return typeof target === 'string';
}

export function isBoolean(target: any): target is boolean {
  return typeof target === 'boolean';
}

export function isNumber(target: any): target is number {
  return typeof target === 'number';
}

export function isObjectLike(target: any): target is object {
  return typeof target === 'object' && target !== null;
}

export function isObject(target: any): target is object {
  return isObjectLike(target) && !isArray(target);
}

export function isPlainObject(target: any): target is object {
  if (!isObject(target)) {
    return false;
  }

  const targetPrototype = Object.getPrototypeOf(target);
  return targetPrototype === Object.prototype || targetPrototype === null;
}

export function isFunction(target: any): target is Function {
  return typeof target === 'function';
}

export function hasOwnProperty(target: object, propertyName: string): boolean {
  return Object.prototype.hasOwnProperty.call(target, propertyName);
}
