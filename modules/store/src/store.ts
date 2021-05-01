/* eslint-disable @typescript-eslint/naming-convention */
// disabled because we have lowercase generics for `select`
import { Injectable, Provider } from '@angular/core';
import { Observable, Observer, Operator } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';

import { ActionsSubject } from './actions_subject';
import { Action, ActionReducer, FunctionIsNotAllowed } from './models';
import { ReducerManager } from './reducer_manager';
import { StateObservable } from './state';

@Injectable()
export class Store<T = object>
  extends Observable<T>
  implements Observer<Action> {
  constructor(
    state$: StateObservable,
    private actionsObserver: ActionsSubject,
    private reducerManager: ReducerManager
  ) {
    super();

    this.source = state$;
  }

  select<K>(mapFn: (state: T) => K): Observable<K>;
  /**
   * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
   */
  select<K, Props = any>(
    mapFn: (state: T, props: Props) => K,
    props: Props
  ): Observable<K>;
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
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c],
    e extends keyof T[a][b][c][d],
    f extends keyof T[a][b][c][d][e],
    K = any
  >(
    key1: a,
    key2: b,
    key3: c,
    key4: d,
    key5: e,
    key6: f,
    ...paths: string[]
  ): Observable<K>;
  select<Props = any, K = any>(
    pathOrMapFn: ((state: T, props?: Props) => K) | string,
    ...paths: string[]
  ): Observable<any> {
    return (select as any).call(null, pathOrMapFn, ...paths)(this);
  }

  lift<R>(operator: Operator<T, R>): Store<R> {
    const store = new Store<R>(this, this.actionsObserver, this.reducerManager);
    store.operator = operator;

    return store;
  }

  dispatch<V extends Action = Action>(
    action: V &
      FunctionIsNotAllowed<
        V,
        'Functions are not allowed to be dispatched. Did you forget to call the action creator function?'
      >
  ) {
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

  removeReducer<Key extends Extract<keyof T, string>>(key: Key) {
    this.reducerManager.removeReducer(key);
  }
}

export const STORE_PROVIDERS: Provider[] = [Store];

export function select<T, K>(
  mapFn: (state: T) => K
): (source$: Observable<T>) => Observable<K>;
/**
 * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
 */
export function select<T, Props, K>(
  mapFn: (state: T, props: Props) => K,
  props: Props
): (source$: Observable<T>) => Observable<K>;
export function select<T, a extends keyof T>(
  key: a
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
export function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b],
  d extends keyof T[a][b][c],
  e extends keyof T[a][b][c][d],
  f extends keyof T[a][b][c][d][e],
  K = any
>(
  key1: a,
  key2: b,
  key3: c,
  key4: d,
  key5: e,
  key6: f,
  ...paths: string[]
): (source$: Observable<T>) => Observable<K>;
export function select<T, Props, K>(
  pathOrMapFn: ((state: T, props?: Props) => any) | string,
  propsOrPath?: Props | string,
  ...paths: string[]
) {
  return function selectOperator(source$: Observable<T>): Observable<K> {
    let mapped$: Observable<any>;

    if (typeof pathOrMapFn === 'string') {
      const pathSlices = [<string>propsOrPath, ...paths].filter(Boolean);
      mapped$ = source$.pipe(pluck(pathOrMapFn, ...pathSlices));
    } else if (typeof pathOrMapFn === 'function') {
      mapped$ = source$.pipe(
        map((source) => pathOrMapFn(source, <Props>propsOrPath))
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
