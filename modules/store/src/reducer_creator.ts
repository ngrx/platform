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

/**
 * @description
 * Associates actions with a given state change function.
 * A state change function must be provided as the last parameter.
 *
 * @param args `ActionCreator`'s followed by a state change function.
 *
 * @returns an association of action types with a state change function.
 *
 * @example
 * on(AuthApiActions.loginSuccess, (state, { user }) => ({ ...state, user }))
 */
export function on<
  C extends ActionCreator[],
  S,
  OR extends OnReducer<S, C> = OnReducer<S, C>,
  AR extends ActionReducer<S> = ActionReducer<S>
>(...args: [...C, OR]): On<S> {
  const reducer = (args.pop() as Function) as AR;
  const types = args.reduce(
    (result, creator) => [...result, (creator as ActionCreator).type],
    [] as string[]
  );
  return { reducer, types };
}

/**
 * @description
 * Creates a reducer function to handle state transitions.
 *
 * Reducer creators reduce the explicitness of reducer functions with switch statements.
 *
 * @param initialState Provides a state value if the current state is `undefined`, as it is initially.
 * @param ons Associations between actions and state changes.
 * @returns A reducer function.
 *
 * @usageNotes
 *
 * - Must be used with `ActionCreator`'s (returned by `createAction`). Cannot be used with class-based action creators.
 * - The returned `ActionReducer` should additionally be wrapped with another function, if you are using View Engine AOT.
 * In case you are using Ivy (or only JIT View Engine) the extra wrapper function is not required.
 *
 * **Declaring a reducer creator**
 *
 * ```ts
 * export const reducer = createReducer(
 *   initialState,
 *   on(
 *     featureActions.actionOne,
 *     featureActions.actionTwo,
 *     (state, { updatedValue }) => ({ ...state, prop: updatedValue })
 *   ),
 *   on(featureActions.actionThree, () => initialState);
 * );
 * ```
 *
 * **Declaring a reducer creator using a wrapper function (Only needed if using View Engine AOT)**
 *
 * ```ts
 * const featureReducer = createReducer(
 *   initialState,
 *   on(
 *     featureActions.actionOne,
 *     featureActions.actionTwo,
 *     (state, { updatedValue }) => ({ ...state, prop: updatedValue })
 *   ),
 *   on(featureActions.actionThree, () => initialState);
 * );
 *
 * export function reducer(state: State | undefined, action: Action) {
 *   return featureReducer(state, action);
 * }
 * ```
 */
export function createReducer<S, A extends Action = Action>(
  initialState: S,
  ...ons: On<S>[]
): ActionReducer<S, A> {
  const map = new Map<string, ActionReducer<S, A>>();
  for (let on of ons) {
    for (let type of on.types) {
      if (map.has(type)) {
        const existingReducer = map.get(type) as ActionReducer<S, A>;
        const newReducer: ActionReducer<S, A> = (state, action) =>
          on.reducer(existingReducer(state, action), action);
        map.set(type, newReducer);
      } else {
        map.set(type, on.reducer);
      }
    }
  }

  return function (state: S = initialState, action: A): S {
    const reducer = map.get(action.type);
    return reducer ? reducer(state, action) : state;
  };
}
