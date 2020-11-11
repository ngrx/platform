import {
  Action,
  ActionReducer,
  ActionReducerFactory,
  ActionReducerMap,
  MetaReducer,
  InitialState,
} from './models';

export function combineReducers<T, V extends Action = Action>(
  reducers: ActionReducerMap<T, V>,
  initialState?: Partial<T>
): ActionReducer<T, V>;
/**
 * @description
 * Combines reducers for individual features into a single reducer.
 *
 * You can use this function to delegate handling of state transitions to multiple reducers, each acting on their
 * own sub-state within the root state.
 *
 * @param reducers An object mapping keys of the root state to their corresponding feature reducer.
 * @param initialState Provides a state value if the current state is `undefined`, as it is initially.
 * @returns A reducer function.
 *
 * @usageNotes
 *
 * **Example combining two feature reducers into one "root" reducer**
 *
 * ```ts
 * export const reducer = combineReducers({
 *   featureA: featureAReducer,
 *   featureB: featureBReducer
 * });
 * ```
 *
 * You can also override the initial states of the sub-features:
 * ```ts
 * export const reducer = combineReducers({
 *   featureA: featureAReducer,
 *   featureB: featureBReducer
 * }, {
 *   featureA: { counterA: 13 },
 *   featureB: { counterB: 37 }
 * });
 * ```
 */
export function combineReducers(
  reducers: any,
  initialState: any = {}
): ActionReducer<any, Action> {
  const reducerKeys = Object.keys(reducers);
  const finalReducers: any = {};

  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  const finalReducerKeys = Object.keys(finalReducers);

  return function combination(state, action) {
    state = state === undefined ? initialState : state;
    let hasChanged = false;
    const nextState: any = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer: any = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);

      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

export function omit<T extends { [key: string]: any }>(
  object: T,
  keyToRemove: keyof T
): Partial<T> {
  return Object.keys(object)
    .filter((key) => key !== keyToRemove)
    .reduce((result, key) => Object.assign(result, { [key]: object[key] }), {});
}

export function compose<A>(): (i: A) => A;
export function compose<A, B>(b: (i: A) => B): (i: A) => B;
export function compose<A, B, C>(c: (i: B) => C, b: (i: A) => B): (i: A) => C;
export function compose<A, B, C, D>(
  d: (i: C) => D,
  c: (i: B) => C,
  b: (i: A) => B
): (i: A) => D;
export function compose<A, B, C, D, E>(
  e: (i: D) => E,
  d: (i: C) => D,
  c: (i: B) => C,
  b: (i: A) => B
): (i: A) => E;
export function compose<A, B, C, D, E, F>(
  f: (i: E) => F,
  e: (i: D) => E,
  d: (i: C) => D,
  c: (i: B) => C,
  b: (i: A) => B
): (i: A) => F;
export function compose<A = any, F = any>(...functions: any[]): (i: A) => F;
export function compose(...functions: any[]) {
  return function (arg: any) {
    if (functions.length === 0) {
      return arg;
    }

    const last = functions[functions.length - 1];
    const rest = functions.slice(0, -1);

    return rest.reduceRight((composed, fn) => fn(composed), last(arg));
  };
}

export function createReducerFactory<T, V extends Action = Action>(
  reducerFactory: ActionReducerFactory<T, V>,
  metaReducers?: MetaReducer<T, V>[]
): ActionReducerFactory<T, V> {
  if (Array.isArray(metaReducers) && metaReducers.length > 0) {
    (reducerFactory as any) = compose.apply(null, [
      ...metaReducers,
      reducerFactory,
    ]);
  }

  return (reducers: ActionReducerMap<T, V>, initialState?: InitialState<T>) => {
    const reducer = reducerFactory(reducers);
    return (state: T | undefined, action: V) => {
      state = state === undefined ? (initialState as T) : state;
      return reducer(state, action);
    };
  };
}

export function createFeatureReducerFactory<T, V extends Action = Action>(
  metaReducers?: MetaReducer<T, V>[]
): (reducer: ActionReducer<T, V>, initialState?: T) => ActionReducer<T, V> {
  const reducerFactory =
    Array.isArray(metaReducers) && metaReducers.length > 0
      ? compose<ActionReducer<T, V>>(...metaReducers)
      : (r: ActionReducer<T, V>) => r;

  return (reducer: ActionReducer<T, V>, initialState?: T) => {
    reducer = reducerFactory(reducer);

    return (state: T | undefined, action: V) => {
      state = state === undefined ? initialState : state;
      return reducer(state, action);
    };
  };
}
