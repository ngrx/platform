import { ActionReducer, Action } from '../models';
import {
  isPlainObject,
  isUndefined,
  isNull,
  isNumber,
  isBoolean,
  isString,
  isArray,
  RUNTIME_CHECK_URL,
  isComponent,
} from './utils';

export function serializationCheckMetaReducer(
  reducer: ActionReducer<any, any>,
  checks: { action: (action: Action) => boolean; state: () => boolean }
): ActionReducer<any, any> {
  return function (state, action) {
    if (checks.action(action)) {
      const unserializableAction = getUnserializable(action);
      throwIfUnserializable(unserializableAction, 'action');
    }

    const nextState = reducer(state, action);

    if (checks.state()) {
      const unserializableState = getUnserializable(nextState);
      throwIfUnserializable(unserializableState, 'state');
    }

    return nextState;
  };
}

function getUnserializable(
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

    // Ignore Ivy components
    if (isComponent(value)) {
      return result;
    }

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
  unserializable: false | { path: string[]; value: any },
  context: 'state' | 'action'
) {
  if (unserializable === false) {
    return;
  }

  const unserializablePath = unserializable.path.join('.');
  const error: any = new Error(
    `Detected unserializable ${context} at "${unserializablePath}". ${RUNTIME_CHECK_URL}#strict${context}serializability`
  );
  error.value = unserializable.value;
  error.unserializablePath = unserializablePath;
  throw error;
}
