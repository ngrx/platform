import { ActionReducer } from '../models';

export function stateSerializationCheckMetaReducer(
  reducer: ActionReducer<any, any>
): ActionReducer<any, any> {
  return function(state, action) {
    const nextState = reducer(state, action);

    const unserializable = getUnserializable(nextState);
    throwIfUnserializable(unserializable);

    return nextState;
  };
}

function getUnserializable<T>(
  target: T,
  path: string[] = []
): false | { path: string[]; value: any } {
  // Catch reducers returning undefined as next state
  if (isUndefined(target) && path.length === 0) {
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

function throwIfUnserializable(
  unserializable: false | { path: string[]; value: any }
) {
  if (unserializable === false) {
    return;
  }

  const unserializablePath = unserializable.path.join('.');
  const error: any = new Error(
    `Detected unserializable state at "${unserializablePath}"`
  );
  error.value = unserializable.value;
  error.unserializablePath = unserializablePath;
  throw error;
}

/**
 * Object Utilities
 */

function isUndefined(target: any): target is undefined {
  return target === undefined;
}

function isNull(target: any): target is null {
  return target === null;
}

function isArray(target: any): target is Array<any> {
  return Array.isArray(target);
}

function isString(target: any): target is string {
  return typeof target === 'string';
}

function isBoolean(target: any): target is boolean {
  return typeof target === 'boolean';
}

function isNumber(target: any): target is number {
  return typeof target === 'number';
}

function isObject(target: any): target is object {
  return typeof target === 'object' && target !== null && !isArray(target);
}

function isPlainObject(target: any): target is object {
  if (!isObject(target)) {
    return false;
  }

  const targetPrototype = Object.getPrototypeOf(target);
  return targetPrototype === Object.prototype || targetPrototype === null;
}
