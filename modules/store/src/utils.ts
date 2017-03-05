import { Action, ActionReducer, ActionReducerMap, ActionReducerFactory } from './models';


export function combineReducers<T, V extends Action>(reducers: ActionReducerMap<T, V>, initialState?: Partial<T>): ActionReducer<T, V>;
export function combineReducers<T>(reducers: ActionReducerMap<T, Action>, initialState?: Partial<T>): ActionReducer<T, Action>;
export function combineReducers(reducers: any, initialState: any = {}): ActionReducer<any, Action> {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};

  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }

  const finalReducerKeys = Object.keys(finalReducers);

  return function combination(state = initialState, action) {
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);

      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

export function omit(object: { [key: string]: any }, keyToRemove: string) {
  return Object.keys(object)
    .filter(key => key !== keyToRemove)
    .reduce((result, key) => result[key] = object[key], {});
}

export function compose<A>(): (i: A) => A;
export function compose<A, B>(b: (i: A) => B): (i: A) => B;
export function compose<A, B, C>(c: (i: B) => C, b: (i: A) => B): (i: A) => C;
export function compose<A, B, C, D>(d: (i: C) => D, c: (i: B) => C, b: (i: A) => B): (i: A) => D;
export function compose<A, B, C, D, E>(e: (i: D) => E, d: (i: C) => D, c: (i: B) => C, b: (i: A) => B): (i: A) => E;
export function compose<A, B, C, D, E, F>(f: (i: E) => F, e: (i: D) => E, d: (i: C) => D, c: (i: B) => C, b: (i: A) => B): (i: A) => F;
export function compose(...functions) {
  return function(arg) {
    if (functions.length === 0) {
      return arg;
    }

    const last = functions[functions.length - 1];
    const rest = functions.slice(0, -1);

    return rest.reduceRight((composed, fn) => fn(composed), last(arg));
  }
}
