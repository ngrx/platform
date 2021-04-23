import { ActionCreator, ActionReducer, ActionType, Action } from './models';

// Goes over the array of ActionCreators, pulls the action type out of each one
// and returns the array of these action types.
type ExtractActionTypes<Creators extends readonly ActionCreator[]> = {
  [Key in keyof Creators]: Creators[Key] extends ActionCreator<infer T>
    ? T
    : never;
};

/**
 * Return type of the `on` fn.
 * Contains the action reducer coupled to one or more action types.
 */
export interface ReducerTypes<
  State,
  Creators extends readonly ActionCreator[]
> {
  reducer: OnReducer<State, Creators>;
  types: ExtractActionTypes<Creators>;
}

// Specialized Reducer that is aware of the Action type it needs to handle
export interface OnReducer<State, Creators extends readonly ActionCreator[]> {
  (state: State, action: ActionType<Creators[number]>): State;
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
 * @usageNotes
 * ```ts
 * on(AuthApiActions.loginSuccess, (state, { user }) => ({ ...state, user }))
 * ```
 */
export function on<State, Creators extends readonly ActionCreator[]>(
  ...args: [
    ...creators: Creators,
    reducer: OnReducer<State extends infer S ? S : never, Creators>
  ]
): ReducerTypes<State, Creators> {
  // This could be refactored when TS releases the version with this fix:
  // https://github.com/microsoft/TypeScript/pull/41544
  const reducer = args.pop() as OnReducer<any, Creators>;
  const types = (((args as unknown) as Creators).map(
    (creator) => creator.type
  ) as unknown) as ExtractActionTypes<Creators>;
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
  ...ons: ReducerTypes<S, ActionCreator[]>[]
): ActionReducer<S, A> {
  const map = new Map<string, OnReducer<S, ActionCreator[]>>();
  for (const on of ons) {
    for (const type of on.types) {
      const existingReducer = map.get(type);
      if (existingReducer) {
        const newReducer: typeof existingReducer = (state, action) =>
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
