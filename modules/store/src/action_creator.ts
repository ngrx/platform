import {
  Creator,
  ActionCreator,
  TypedAction,
  FunctionWithParametersType,
  PropsReturnType,
  DisallowTypeProperty,
} from './models';

// Action creators taken from ts-action library and modified a bit to better
// fit current NgRx usage. Thank you Nicholas Jamieson (@cartant).

export function createAction<T extends string>(
  type: T
): ActionCreator<T, () => TypedAction<T>>;
export function createAction<T extends string, P extends object>(
  type: T,
  config: { _as: 'props'; _p: P }
): ActionCreator<T, (props: P) => P & TypedAction<T>>;
export function createAction<
  T extends string,
  P extends any[],
  R extends object
>(
  type: T,
  creator: Creator<P, DisallowTypeProperty<R>>
): FunctionWithParametersType<P, R & TypedAction<T>> & TypedAction<T>;
export function createAction<T extends string, C extends Creator>(
  type: T,
  config?: { _as: 'props' } | C
): Creator {
  if (typeof config === 'function') {
    return defineType(type, (...args: any[]) => ({
      ...config(...args),
      type,
    }));
  }
  const as = config ? config._as : 'empty';
  switch (as) {
    case 'empty':
      return defineType(type, () => ({ type }));
    case 'props':
      return defineType(type, (props: object) => ({
        ...props,
        type,
      }));
    default:
      throw new Error('Unexpected config.');
  }
}

export function props<P extends object>(): PropsReturnType<P> {
  // the return type does not match TypePropertyIsNotAllowed, so double casting
  // is used.
  return ({ _as: 'props', _p: undefined! } as unknown) as PropsReturnType<P>;
}

export function union<
  C extends { [key: string]: ActionCreator<string, Creator> }
>(creators: C): ReturnType<C[keyof C]> {
  return undefined!;
}

function defineType(type: string, creator: Creator): Creator {
  return Object.defineProperty(creator, 'type', {
    value: type,
    writable: false,
  });
}
