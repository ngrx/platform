import { Injectable, Provider } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { map } from 'rxjs/operator/map';
import { pluck } from 'rxjs/operator/pluck';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { Action, ActionReducer, Selector } from './models';
import { ActionsSubject } from './actions_subject';
import { LocalState, LocalStoreOptions } from './local_state';
import { createSelector } from './selector';
import { StateObservable } from './state';
import { ReducerManager } from './reducer_manager';

@Injectable()
export class Store<T> extends Observable<T> implements Observer<Action> {
  constructor(
    state$: StateObservable,
    private actionsObserver: ActionsSubject,
    private reducerManager: ReducerManager,
    private localState: LocalState<T>
  ) {
    super();

    this.source = state$;
  }

  select<K>(mapFn: (state: T) => K): Store<K>;
  select<a extends keyof T>(key: a): Store<T[a]>;
  select<a extends keyof T, b extends keyof T[a]>(
    key1: a,
    key2: b
  ): Store<T[a][b]>;
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(
    key1: a,
    key2: b,
    key3: c
  ): Store<T[a][b][c]>;
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c]
  >(key1: a, key2: b, key3: c, key4: d): Store<T[a][b][c][d]>;
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c],
    e extends keyof T[a][b][c][d]
  >(key1: a, key2: b, key3: c, key4: d, key5: e): Store<T[a][b][c][d][e]>;
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
  ): Store<T[a][b][c][d][e][f]>;
  select(
    pathOrMapFn: ((state: T) => any) | string,
    ...paths: string[]
  ): Store<any> {
    return select(pathOrMapFn, ...paths)(this);
  }

  lift<R>(operator: Operator<T, R>): Store<R> {
    const store = new Store<R>(
      this,
      this.actionsObserver,
      this.reducerManager,
      this.localState as any
    );

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

  removeReducer<Key extends keyof T>(key: Key) {
    this.reducerManager.removeReducer(key);
  }

  createLocalStore<R>(options: LocalStoreOptions<R>) {
    return this.localState.createLocalStore(options);
  }
}

export const STORE_PROVIDERS: Provider[] = [Store];

export function select<T, K>(
  mapFn: ((state: T) => K) | string
): (source$: Observable<T>) => Store<K>;
export function select<T, S1, R>(
  s1: Selector<T, S1>,
  projector: (s1: S1) => R
): (source$: Observable<T>) => Store<R>;
export function select<T, S1, S2, R>(
  s1: Selector<T, S1>,
  s2: Selector<T, S2>,
  projector: (s1: S1, s2: S2) => R
): (source$: Observable<T>) => Store<R>;
export function select<T, S1, S2, S3, R>(
  s1: Selector<T, S1>,
  s2: Selector<T, S2>,
  s3: Selector<T, S3>,
  projector: (s1: S1, s2: S2, s3: S3) => R
): (source$: Observable<T>) => Store<R>;
export function select<T, S1, S2, S3, S4, R>(
  s1: Selector<T, S1>,
  s2: Selector<T, S2>,
  s3: Selector<T, S3>,
  s4: Selector<T, S4>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4) => R
): (source$: Observable<T>) => Store<R>;
export function select<T, S1, S2, S3, S4, S5, R>(
  s1: Selector<T, S1>,
  s2: Selector<T, S2>,
  s3: Selector<T, S3>,
  s4: Selector<T, S4>,
  s5: Selector<T, S5>,
  projector: (s1: S1, s2: S2, s3: S3, s4: S4, s5: S5) => R
): (source$: Observable<T>) => Store<R>;
export function select<T, a extends keyof T>(
  key: a
): (source$: Store<a>) => Store<T[a]>;
export function select<T, a extends keyof T, b extends keyof T[a]>(
  key1: a,
  key2: b
): (source$: Store<T>) => Store<T[a][b]>;
export function select<
  T,
  a extends keyof T,
  b extends keyof T[a],
  c extends keyof T[a][b]
>(key1: a, key2: b, key3: c): (source$: Store<a>) => Store<T[a][b][c]>;
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
): (source$: Store<a>) => Store<T[a][b][c][d]>;
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
): (source$: Store<a>) => Store<T[a][b][c][d][e]>;
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
): (source$: Store<a>) => Store<T[a][b][c][d][e][f]>;
export function select<T, K>(
  pathOrMapFn: ((state: T) => any) | string,
  ...paths: (string | ((...args: any[]) => any[]))[]
) {
  return function selectOperator(source$: Store<T>): Store<K> {
    let mapped$: Store<any>;

    if (typeof pathOrMapFn === 'string') {
      mapped$ = pluck.call(source$, pathOrMapFn, ...(paths as any[]));
    } else if (typeof pathOrMapFn === 'function' && paths.length === 0) {
      mapped$ = map.call(source$, pathOrMapFn);
    } else if (typeof pathOrMapFn === 'function' && paths.length > 0) {
      mapped$ = map.call(
        source$,
        (createSelector as any)(pathOrMapFn, ...paths)
      );
    } else {
      throw new TypeError(
        `Unexpected type '${typeof pathOrMapFn}' in select operator,` +
          ` expected 'string' or 'function'`
      );
    }

    return distinctUntilChanged.call(mapped$);
  };
}
