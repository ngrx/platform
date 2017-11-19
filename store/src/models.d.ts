export interface Action {
    type: string;
}
export declare type TypeId<T> = () => T;
export declare type InitialState<T> = Partial<T> | TypeId<Partial<T>> | void;
export interface ActionReducer<T, V extends Action = Action> {
    (state: T | undefined, action: V): T;
}
export declare type ActionReducerMap<T, V extends Action = Action> = {
    [p in keyof T]: ActionReducer<T[p], V>;
};
export interface ActionReducerFactory<T, V extends Action = Action> {
    (reducerMap: ActionReducerMap<T, V>, initialState?: InitialState<T>): ActionReducer<T, V>;
}
export declare type MetaReducer<T, V extends Action = Action> = (reducer: ActionReducer<T, V>) => ActionReducer<T, V>;
export interface StoreFeature<T, V extends Action = Action> {
    key: string;
    reducers: ActionReducerMap<T, V> | ActionReducer<T, V>;
    reducerFactory: ActionReducerFactory<T, V>;
    initialState?: InitialState<T>;
    metaReducers?: MetaReducer<T, V>[];
}
export interface Selector<T, V> {
    (state: T): V;
}
