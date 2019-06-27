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
/**
 * @description
 * Creates a configured `Creator` function that, when called, returns an object in the shape of the `Action` interface.
 *
 * Action creators reduce the explicitness of class-based action creators.
 *
 * @param type Describes the action that will be dispatched in your application
 * @param config Additional metadata needed for the handling of the action.  See {@link createAction#usage-notes Usage Notes}.
 *
 * @usageNotes
 *
 * **Declaring an action creator**
 *
 * Without additional metadata:
 * ```ts
 * export const increment = createAction('[Counter] Increment');
 * ```
 * With additional metadata:
 * ```ts
 * export const loginSuccess = createAction(
 *   '[Auth/API] Login Success',
 *   props<{ user: User }>()
 * );
 * ```
 *
 * **Dispatching an action**
 *
 * Without additional metadata:
 * ```ts
 * store.dispatch(increment());
 * ```
 * With additional metadata:
 * ```ts
 * store.dispatch(loginSuccess({ user: newUser }));
 * ```
 *
 * **Referencing an action in a reducer**
 *
 * Using a switch statement:
 * ```ts
 * switch (action.type) {
 *   // ...
 *   case AuthApiActions.loginSuccess.type: {
 *     return {
 *       ...state,
 *       user: action.user
 *     };
 *   }
 * }
 * ```
 * Using a reducer creator:
 * ```ts
 * on(AuthApiActions.loginSuccess, (state, { user }) => ({ ...state, user }))
 * ```
 */
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
