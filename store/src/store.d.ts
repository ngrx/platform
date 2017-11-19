import { Provider } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Action, ActionReducer } from './models';
import { ActionsSubject } from './actions_subject';
import { StateObservable } from './state';
import { ReducerManager } from './reducer_manager';
export declare class Store<T> extends Observable<T> implements Observer<Action> {
    private actionsObserver;
    private reducerManager;
    constructor(state$: StateObservable, actionsObserver: ActionsSubject, reducerManager: ReducerManager);
    select<K>(mapFn: (state: T) => K): Store<K>;
    select<a extends keyof T>(key: a): Store<T[a]>;
    select<a extends keyof T, b extends keyof T[a]>(key1: a, key2: b): Store<T[a][b]>;
    select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(key1: a, key2: b, key3: c): Store<T[a][b][c]>;
    select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c]>(key1: a, key2: b, key3: c, key4: d): Store<T[a][b][c][d]>;
    select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d]>(key1: a, key2: b, key3: c, key4: d, key5: e): Store<T[a][b][c][d][e]>;
    select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d], f extends keyof T[a][b][c][d][e]>(key1: a, key2: b, key3: c, key4: d, key5: e, key6: f): Store<T[a][b][c][d][e][f]>;
    lift<R>(operator: Operator<T, R>): Store<R>;
    dispatch<V extends Action = Action>(action: V): void;
    next(action: Action): void;
    error(err: any): void;
    complete(): void;
    addReducer<State, Actions extends Action = Action>(key: string, reducer: ActionReducer<State, Actions>): void;
    removeReducer<Key extends keyof T>(key: Key): void;
}
export declare const STORE_PROVIDERS: Provider[];
