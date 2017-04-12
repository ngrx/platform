export interface Action {
  type: string;
}

export interface ActionReducer<T, V extends Action = Action> {
  (state: T | undefined, action: V): T;
}

export type ActionReducerMap<T, V extends Action = Action> = {
  [p in keyof T]: ActionReducer<T[p], V>;
};

export interface ActionReducerFactory<T, V extends Action = Action> {
  (reducerMap: ActionReducerMap<T, V>, initialState?: Partial<T>): ActionReducer<T, V>;
}

export interface StoreFeature<T, V extends Action = Action> {
  key: string;
  reducers: ActionReducerMap<T, V>;
  reducerFactory: ActionReducerFactory<T, V>;
  initialState: T | undefined;
}
