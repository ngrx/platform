import { Injectable, Provider } from '@angular/core';
import { Observable, Observer, Operator } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';

import { ActionsSubject } from './actions_subject';
import { Action, ActionReducer } from './models';
import { ReducerManager } from './reducer_manager';
import { StateObservable } from './state';

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

  /**
   * @deprecated from 6.1.0. Use the pipeable `select` operator instead.
   */
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
  /**
   * This overload is used to support spread operator with
   * fixed length tuples type in typescript 2.7
   */
  select<K = any>(...paths: string[]): Observable<K>;
  select(
    pathOrMapFn: ((state: T) => any) | string,
    ...paths: string[]
  ): Observable<any> {
    return select.call(null, pathOrMapFn, ...paths)(this);
  }

  lift<R>(operator: Operator<T, R>): Store<R> {
    const store = new Store<R>(this, this.actionsObserver, this.reducerManager);
    store.operator = operator;

    return store;
  }

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

  // Once TS is >= 2.8 replace with <Key extends Extract<keyof T, string>>
  removeReducer<Key extends keyof T>(key: Key) {
    // TS2.9: keyof T is string|number|symbol, explicitly cast to string to fix.
    this.reducerManager.removeReducer(key as string);
  }
}

export const STORE_PROVIDERS: Provider[] = [Store];

export function select<T, Props, K>(
  mapFn: (state: T, props: Props) => K,
  props?: Props
): (source$: Observable<T>) => Observable<K>;
export function select<T, a extends keyof T>(
  key: a,
  props: null
): (source$: Observable<T>) => Observable<T[a]>;
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
): (source$: Observable<T>) => Observable<T[a][b][c]>;
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
): (source$: Observable<T>) => Observable<T[a][b][c][d]>;
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
): (source$: Observable<T>) => Observable<T[a][b][c][d][e]>;
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
): (source$: Observable<T>) => Observable<T[a][b][c][d][e][f]>;
/**
 * This overload is used to support spread operator with
 * fixed length tuples type in typescript 2.7
 */
export function select<T, Props = any, K = any>(
  propsOrPath: Props,
  ...paths: string[]
): (source$: Observable<T>) => Observable<K>;
export function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath: Props | string,
  ...paths: string[]
) {
  return function selectOperator(source$: Observable<T>): Observable<K> {
    let mapped$: Observable<any>;

    if (typeof pathOrMapFn === 'string') {
      const pathSlices = [<string>propsOrPath, ...paths].filter(Boolean);
      mapped$ = source$.pipe(pluck(pathOrMapFn, ...pathSlices));
    } else if (typeof pathOrMapFn === 'function') {
      mapped$ = source$.pipe(
        map(source => pathOrMapFn(source, <Props>propsOrPath))
      );
    } else {
      throw new TypeError(
        `Unexpected type '${typeof pathOrMapFn}' in select operator,` +
          ` expected 'string' or 'function'`
      );
    }

    return mapped$.pipe(distinctUntilChanged());
  };
}
