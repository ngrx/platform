export interface Action {
  type: string;
}

// declare to make it property-renaming safe
export declare interface TypedAction<T extends string> extends Action {
  readonly type: T;
}

export type ActionType<A> = A extends ActionCreator<infer T, infer C>
  ? ReturnType<C> & { type: T }
  : never;

export type TypeId<T> = () => T;

export type InitialState<T> = Partial<T> | TypeId<Partial<T>> | void;

/**
 * A function that takes an `Action` and a `State`, and returns a `State`.
 * See `createReducer`.
 */
export interface ActionReducer<T, V extends Action = Action> {
  (state: T | undefined, action: V): T;
}

export type ActionReducerMap<T, V extends Action = Action> = {
  [p in keyof T]: ActionReducer<T[p], V>;
};

export interface ActionReducerFactory<T, V extends Action = Action> {
  (
    reducerMap: ActionReducerMap<T, V>,
    initialState?: InitialState<T>
  ): ActionReducer<T, V>;
}

export type MetaReducer<T = any, V extends Action = Action> = (
  reducer: ActionReducer<T, V>
) => ActionReducer<T, V>;

export interface StoreFeature<T, V extends Action = Action> {
  key: string;
  reducers: ActionReducerMap<T, V> | ActionReducer<T, V>;
  reducerFactory: ActionReducerFactory<T, V>;
  initialState?: InitialState<T>;
  metaReducers?: MetaReducer<T, V>[];
}

export type Selector<T, V> = (state: T) => V;

/**
 * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
 */
export type SelectorWithProps<State, Props, Result> = (
  state: State,
  props: Props
) => Result;

export const arraysAreNotAllowedMsg =
  'arrays are not allowed in action creators';
type ArraysAreNotAllowed = typeof arraysAreNotAllowedMsg;

export const typePropertyIsNotAllowedMsg =
  'type property is not allowed in action creators';
type TypePropertyIsNotAllowed = typeof typePropertyIsNotAllowedMsg;

export const emptyObjectsAreNotAllowedMsg =
  'empty objects are not allowed in action creators';
type EmptyObjectsAreNotAllowed = typeof emptyObjectsAreNotAllowedMsg;

export type FunctionIsNotAllowed<
  T,
  ErrorMessage extends string
> = T extends Function ? ErrorMessage : T;
/**
 * A function that returns an object in the shape of the `Action` interface.  Configured using `createAction`.
 */
export type Creator<
  P extends any[] = any[],
  R extends object = object
> = FunctionWithParametersType<P, R>;

export type NotAllowedCheck<T extends object> = T extends any[]
  ? ArraysAreNotAllowed
  : T extends { type: any }
  ? TypePropertyIsNotAllowed
  : keyof T extends never
  ? EmptyObjectsAreNotAllowed
  : unknown;

/**
 * See `Creator`.
 */
export type ActionCreator<
  T extends string = string,
  C extends Creator = Creator
> = C & TypedAction<T>;

export interface ActionCreatorProps<T> {
  _as: 'props';
  _p: T;
}

export type FunctionWithParametersType<P extends unknown[], R = void> = (
  ...args: P
) => R;

export type ParametersType<T> = T extends (...args: infer U) => unknown
  ? U
  : never;

export interface RuntimeChecks {
  /**
   * Verifies if the state is serializable
   */
  strictStateSerializability: boolean;
  /**
   * Verifies if the actions are serializable. Please note, you may not need to set it to `true` unless you are storing/replaying actions using external resources, for example `localStorage`.
   */
  strictActionSerializability: boolean;
  /**
   * Verifies that the state isn't mutated
   */
  strictStateImmutability: boolean;
  /**
   * Verifies that actions aren't mutated
   */
  strictActionImmutability: boolean;

  /**
   * Verifies that actions are dispatched within NgZone
   */
  strictActionWithinNgZone: boolean;

  /**
   * Verifies that action types are not registered more than once
   */
  strictActionTypeUniqueness?: boolean;
}
