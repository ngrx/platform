import { ActionCreator, ActionReducer, ActionType, Action } from './models';

// Return type of the `on` fn.
export interface On<S> {
  reducer: ActionReducer<S>;
  types: string[];
}

// Specialized Reducer that is aware of the Action type it needs to handle
export interface OnReducer<S, C extends ActionCreator[]> {
  (state: S, action: ActionType<C[number]>): S;
}

export function on<C1 extends ActionCreator, S>(
  creator1: C1,
  reducer: OnReducer<S, [C1]>
): On<S>;
export function on<C1 extends ActionCreator, C2 extends ActionCreator, S>(
  creator1: C1,
  creator2: C2,
  reducer: OnReducer<S, [C1, C2]>
): On<S>;
export function on<
  C1 extends ActionCreator,
  C2 extends ActionCreator,
  C3 extends ActionCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  reducer: OnReducer<S, [C1, C2, C3]>
): On<S>;
export function on<S>(
  creator: ActionCreator,
  ...rest: (ActionCreator | OnReducer<S, [ActionCreator]>)[]
): On<S>;
export function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] } {
  const reducer = args.pop() as Function;
  const types = args.reduce(
    (result, creator) => [...result, (creator as ActionCreator).type],
    [] as string[]
  );
  return { reducer, types };
}

export function createReducer<S>(
  initialState: S,
  ...ons: On<S>[]
): ActionReducer<S> {
  const map = new Map<string, ActionReducer<S>>();
  for (let on of ons) {
    for (let type of on.types) {
      map.set(type, on.reducer);
    }
  }
  return function(state: S = initialState, action: Action): S {
    const reducer = map.get(action.type);
    return reducer ? reducer(state, action) : state;
  };
}
