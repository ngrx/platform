import {
  Creator,
  ActionCreator,
  TypedAction,
  FunctionWithParametersType,
  ParametersType,
} from './models';

/**
 * Action creators taken from ts-action library and modified a bit to better
 * fit current NgRx usage. Thank you Nicholas Jamieson (@cartant).
 */
export function createAction<T extends string>(
  type: T
): ActionCreator<T, () => TypedAction<T>>;
export function createAction<T extends string, P extends object>(
  type: T,
  config: { _as: 'props'; _p: P }
): ActionCreator<T, (props: P) => P & TypedAction<T>>;
export function createAction<T extends string, C extends Creator>(
  type: T,
  creator: C
): FunctionWithParametersType<
  ParametersType<C>,
  ReturnType<C> & TypedAction<T>
> &
  TypedAction<T>;
export function createAction<T extends string>(
  type: T,
  config?: { _as: 'props' } | Creator
): Creator {
  if (typeof config === 'function') {
    return defineType(type, (...args: unknown[]) => ({
      ...config(...args),
      type,
    }));
  }
  const as = config ? config._as : 'empty';
  switch (as) {
    case 'empty':
      return defineType(type, () => ({ type }));
    case 'props':
      return defineType(type, (props: unknown) => ({
        ...(props as object),
        type,
      }));
    default:
      throw new Error('Unexpected config.');
  }
}

export function props<P>(): { _as: 'props'; _p: P } {
  return { _as: 'props', _p: undefined! };
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
