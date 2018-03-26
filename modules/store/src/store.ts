import { Injectable, Provider } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { map, pluck, distinctUntilChanged } from 'rxjs/operators';
import { Action, ActionReducer } from './models';
import { ActionsSubject } from './actions_subject';
import { StateObservable } from './state';
import { ReducerManager } from './reducer_manager';

@Injectable()
export class Store<T> extends Observable<T> implements Observer<Action> {
  constructor(
    state$: StateObservable,
    private actionsObserver: ActionsSubject,
    private reducerManager: ReducerManager
  ) {
    super();

    this.source = state$;
  }

  select<K>(mapFn: (state: T) => K): Observable<K>;
  select<a extends keyof T>(key: a): Observable<T[a]>;
  select<a extends keyof T, b extends keyof T[a]>(
    key1: a,
    key2: b
  ): Observable<T[a][b]>;
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(
    key1: a,
    key2: b,
    key3: c
  ): Observable<T[a][b][c]>;
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c]
  >(key1: a, key2: b, key3: c, key4: d): Observable<T[a][b][c][d]>;
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c],
    e extends keyof T[a][b][c][d]
  >(key1: a, key2: b, key3: c, key4: d, key5: e): Observable<T[a][b][c][d][e]>;
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c],
    e extends keyof T[a][b][c][d],
    f extends keyof T[a][b][c][d][e]
  >(
    key1: a,
    key2: b,
    key3: c,
    key4: d,
    key5: e,
    key6: f
  ): Observable<T[a][b][c][d][e][f]>;
  select(
    pathOrMapFn: ((state: T) => any) | string,
    ...paths: string[]
  ): Observable<any> {
    return select(pathOrMapFn, ...paths)(this);
  }

  // lift<R>(operator: Operator<T, R>): Store<R> {
  //   const store = new Store<R>(this, this.actionsObserver, this.reducerManager);
  //   store.operator = operator;

  //   return store;
  // }

  dispatch<V extends Action = Action>(action: V) {
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

  addReducer<State, Actions extends Action = Action>(
    key: string,
    reducer: ActionReducer<State, Actions>
  ) {
    this.reducerManager.addReducer(key, reducer);
  }

  removeReducer<Key extends keyof T>(key: Key) {
    this.reducerManager.removeReducer(key);
  }
}

export const STORE_PROVIDERS: Provider[] = [Store];

export function select<T, K>(
  mapFn: ((state: T) => K) | string
): (source$: Observable<T>) => Observable<K>;
export function select<T, a extends keyof T>(
  key: a
): (source$: Observable<a>) => Observable<T[a]>;
export function select<T, a extends keyof T, b extends keyof T[a]>(
  key1: a,
  key2: b
): (source$: Observable<T>) => Observable<T[a][b]>;
export function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b]
>(
  key1: a,
  key2: b,
  key3: c
): (source$: Observable<a>) => Observable<T[a][b][c]>;
export function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b],
  d extends keyof T[a][b][c]
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d
): (source$: Observable<a>) => Observable<T[a][b][c][d]>;
export function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b],
  d extends keyof T[a][b][c],
  e extends keyof T[a][b][c][d]
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d,
  key5: e
): (source$: Observable<a>) => Observable<T[a][b][c][d][e]>;
export function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b],
  d extends keyof T[a][b][c],
  e extends keyof T[a][b][c][d],
  f extends keyof T[a][b][c][d][e]
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d,
  key5: e,
  key6: f
): (source$: Observable<a>) => Observable<T[a][b][c][d][e][f]>;
export function select<T, K>(
  pathOrMapFn: ((state: T) => any) | string,
  ...paths: string[]
) {
  return function selectOperator(source$: Observable<T>): Observable<K> {
    if (typeof pathOrMapFn === 'string') {
      return (source$.pipe(pluck(pathOrMapFn, ...paths)) as Observable<K>).pipe(
        distinctUntilChanged()
      );
    } else if (typeof pathOrMapFn === 'function') {
      return source$.pipe(map(pathOrMapFn), distinctUntilChanged());
    } else {
      throw new TypeError(
        `Unexpected type '${typeof pathOrMapFn}' in select operator,` +
          ` expected 'string' or 'function'`
      );
    }
  };
}
