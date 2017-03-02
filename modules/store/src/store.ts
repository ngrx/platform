import { Injectable, Provider } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { map } from 'rxjs/operator/map';
import { pluck } from 'rxjs/operator/pluck';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { Action, ActionReducer } from './models';
import { ActionsSubject } from './actions_subject';
import { StateObservable } from './state';
import { ReducerManager } from './reducer_manager';


@Injectable()
export class Store<T> extends Observable<Readonly<T>> implements Observer<Action> {
  constructor(
    state$: StateObservable,
    private actionsObserver: ActionsSubject,
    private reducerManager: ReducerManager
  ) {
    super();

    this.source = state$;
  }

  select<K>(mapFn: (state: T) => K): Store<K>;
  select<a extends keyof T>(key: a): Store<T[a]>;
  select<a extends keyof T, b extends keyof T[a]>(key1: a, key2: b): Store<T[a][b]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(key1: a, key2: b, key3: c): Store<T[a][b][c]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c]>(key1: a, key2: b, key3: c, key4: d): Store<T[a][b][c][d]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d]>(key1: a, key2: b, key3: c, key4: d, key5: e): Store<T[a][b][c][d][e]>
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b], d extends keyof T[a][b][c], e extends keyof T[a][b][c][d], f extends keyof T[a][b][c][d][e]>(key1: a, key2: b, key3: c, key4: d, key5: e, key6: f): Store<T[a][b][c][d][e][f]>
  select(pathOrMapFn: ((state: T) => any) | string, ...paths: string[]): Store<any> {
    let mapped$: Store<any>;

    if (typeof pathOrMapFn === 'string') {
      mapped$ = pluck.call(this, pathOrMapFn, ...paths);
    }
    else if (typeof pathOrMapFn === 'function') {
      mapped$ = map.call(this, pathOrMapFn);
    }
    else {
      throw new TypeError(`Unexpected type '${ typeof pathOrMapFn }' in select operator,`
        + ` expected 'string' or 'function'`);
    }

    return distinctUntilChanged.call(mapped$);
  }

  lift<R>(operator: Operator<T, R>): Store<R> {
    const store = new Store<R>(this, this.actionsObserver, this.reducerManager);
    store.operator = operator;

    return store;
  }

  dispatch<V extends Action>(action: V) {
    this.actionsObserver.next(action);
  }

  next(action: Action) {
    this.actionsObserver.next(action);
  }

  error(err: any) {
    this.actionsObserver.error(err);
  }

  complete() {
    this.actionsObserver.complete();
  }

  addReducer<State, Actions extends Action>(key: string, reducer: ActionReducer<State, Actions>) {
    this.reducerManager.addReducer(key, reducer);
  }

  removeReducer<Key extends keyof T>(key: Key) {
    this.reducerManager.removeReducer(key);
  }
}

export const STORE_PROVIDERS: Provider[] = [
  Store
];
