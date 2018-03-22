import { InjectionToken, isDevMode, Provider } from '@angular/core';
import { META_REDUCERS } from './meta_reducers';
import { MetaReducer, Immutable, ActionReducer } from './models';

/**
 * Flags used to enable or disable various runtime checks that will be applied
 * to state and actions.
 */
export enum RuntimeChecks {
  None = 0b00,
  Serializability = 0b01,
  Immutability = 0b10,
  All = 0b11,
}

export const USER_DISABLED_RUNTIME_CHECKS = new InjectionToken<RuntimeChecks[]>(
  '@ngrx/store/runtime-checks'
);
export const ACTIVE_RUNTIME_CHECKS = new InjectionToken<RuntimeChecks>(
  '@ngrx/store/active-runtime-checks'
);
export const SHOULD_CHECK_IMMUTABILITY = new InjectionToken<boolean>(
  '@ngrx/store/check-immutability'
);
export const SHOULD_CHECK_SERIALIZABILITY = new InjectionToken<boolean>(
  '@ngrx/store/check-serializability'
);

export function createActiveRuntimeChecks(
  disabledRuntimeChecks: RuntimeChecks[]
): RuntimeChecks {
  if (!isDevMode()) {
    return RuntimeChecks.None;
  }

  return disabledRuntimeChecks.reduce(
    (flags, nextFlag) => flags & ~nextFlag,
    RuntimeChecks.All
  );
}

export function createShouldCheckImmutability(
  activeRuntimeChecks: RuntimeChecks
): boolean {
  return Boolean(activeRuntimeChecks & RuntimeChecks.Immutability);
}

export function createShouldCheckSerializability(
  activeRuntimeChecks: RuntimeChecks
): boolean {
  return Boolean(activeRuntimeChecks & RuntimeChecks.Serializability);
}

export function createFreezeMetaReducer(
  shouldCheckImmutability: boolean
): MetaReducer<any, any> {
  return reducer =>
    !shouldCheckImmutability ? reducer : freezeMetaReducer(reducer);
}

function freezeMetaReducer(
  reducer: ActionReducer<any, any>
): ActionReducer<any, any> {
  return function(state, action) {
    return freeze(reducer(state, freeze(action)));
  };
}

export function freeze<T extends object>(target: T): Immutable<T> {
  if (isFunction(target) || isNull(target) || isUndefined(target)) {
    return target as any;
  }

  Object.freeze(target);

  const properties: (keyof T)[] = Object.getOwnPropertyNames(target) as any;

  properties.forEach((propertyName: keyof T) => {
    const value = target[propertyName];

    if (
      hasOwnProperty(target, propertyName) &&
      (isArray(value) || isObject(value)) &&
      !Object.isFrozen(value)
    ) {
      freeze(value);
    }
  });

  return target as any;
}

export function createSerializationCheckMetaReducer(
  shouldCheckSerializability: boolean
): MetaReducer<any, any> {
  return reducer =>
    !shouldCheckSerializability
      ? reducer
      : serializationCheckMetaReducer(reducer);
}

export function serializationCheckMetaReducer(
  reducer: ActionReducer<any, any>
): ActionReducer<any, any> {
  return function(state, action) {
    const nextState = reducer(state, action);

    const unserializablePath = getUnserializablePaths(nextState);

    if (unserializablePath) {
      const stringPath = unserializablePath.join('.');
      const value = unserializablePath.reduce(
        (object: any, propertyName: string) => {
          return object[propertyName];
        },
        nextState
      );

      const error: any = new Error(
        `Detected unserializable state at "${stringPath}"`
      );
      error.value = value;
      error.unserializablePath = unserializablePath;

      throw error;
    }

    return nextState;
  };
}

export function getUnserializablePaths<T>(
  target: T,
  path: string[] = []
): false | string[] {
  const keys: (keyof T)[] = Object.keys(target) as any;

  return keys.reduce<false | string[]>((result, key) => {
    if (result) {
      return result;
    }

    const value = target[key];

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
      return getUnserializablePaths(value, [...path, key]);
    }

    return path;
  }, false);
}

/**
 * Object Utilities
 */
function hasOwnProperty(target: object, propertyName: string): boolean {
  return Object.prototype.hasOwnProperty.call(target, propertyName);
}

function isUndefined(target: any): target is undefined {
  return target === undefined;
}

function isNull(target: any): target is null {
  return target === null;
}

function isFunction(target: any): target is Function {
  return typeof target === 'function';
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

export function provideRuntimeChecks(
  disabledRuntimeChecks: RuntimeChecks[]
): Provider[] {
  return [
    {
      provide: USER_DISABLED_RUNTIME_CHECKS,
      useValue: disabledRuntimeChecks,
    },
    {
      provide: ACTIVE_RUNTIME_CHECKS,
      deps: [USER_DISABLED_RUNTIME_CHECKS],
      useFactory: createActiveRuntimeChecks,
    },
    {
      provide: SHOULD_CHECK_IMMUTABILITY,
      deps: [ACTIVE_RUNTIME_CHECKS],
      useFactory: createShouldCheckImmutability,
    },
    {
      provide: SHOULD_CHECK_SERIALIZABILITY,
      deps: [ACTIVE_RUNTIME_CHECKS],
      useFactory: createShouldCheckSerializability,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [SHOULD_CHECK_IMMUTABILITY],
      useFactory: createFreezeMetaReducer,
    },
    {
      provide: META_REDUCERS,
      multi: true,
      deps: [SHOULD_CHECK_SERIALIZABILITY],
      useFactory: createSerializationCheckMetaReducer,
    },
  ];
}
