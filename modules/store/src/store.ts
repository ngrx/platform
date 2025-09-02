// disabled because we have lowercase generics for `select`
import {
  computed,
  effect,
  EffectRef,
  inject,
  Injectable,
  Injector,
  Provider,
  Signal,
  untracked,
} from '@angular/core';
import { Observable, Observer, Operator } from 'rxjs';
import { distinctUntilChanged, map, pluck } from 'rxjs/operators';

import { ActionsSubject } from './actions_subject';
import {
  Action,
  ActionReducer,
  CreatorsNotAllowedCheck,
  SelectSignalOptions,
} from './models';
import { ReducerManager } from './reducer_manager';
import { StateObservable } from './state';
import { assertDefined } from './helpers';

@Injectable()
/**
 * @description
 * Store is an injectable service that provides reactive state management and a public API for dispatching actions.
 *
 * @usageNotes
 *
 * In a component:
 *
 * ```ts
 * import { Component, inject } from '@angular/core';
 * import { Store } from '@ngrx/store';
 *
 * @Component({
 *  selector: 'app-my-component',
 *  template: `
 *    <div>{{ count() }}</div>
 *    <button (click)="increment()">Increment</button>
 *  `
 * })
 * export class MyComponent {
 *   private store = inject(Store);
 *
 *   count = this.store.selectSignal(state => state.count);
 *
 *   increment() {
 *     this.store.dispatch({ type: 'INCREMENT' });
 *   }
 * }
 * ```
 *
 */
export class Store<T = object>
  extends Observable<T>
  implements Observer<Action>
{
  /**
   * @internal
   */
  readonly state: Signal<T>;

  constructor(
    state$: StateObservable,
    private actionsObserver: ActionsSubject,
    private reducerManager: ReducerManager,
    private injector?: Injector
  ) {
    super();

    this.source = state$;
    this.state = state$.state;
  }

  select<K>(mapFn: (state: T) => K): Observable<K>;
  /**
   * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
   */
  select<K, Props = any>(
    mapFn: (state: T, props: Props) => K,
    props: Props
  ): Observable<K>;
  /**
   * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
   */
  select<a extends keyof T>(key: a): Observable<T[a]>;
  /**
   * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
   */
  select<a extends keyof T, b extends keyof T[a]>(
    key1: a,
    key2: b
  ): Observable<T[a][b]>;
  /**
   * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
   */
  select<a extends keyof T, b extends keyof T[a], c extends keyof T[a][b]>(
    key1: a,
    key2: b,
    key3: c
  ): Observable<T[a][b][c]>;
  /**
   * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
   */
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c],
  >(key1: a, key2: b, key3: c, key4: d): Observable<T[a][b][c][d]>;
  /**
   * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
   */
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c],
    e extends keyof T[a][b][c][d],
  >(key1: a, key2: b, key3: c, key4: d, key5: e): Observable<T[a][b][c][d][e]>;
  /**
   * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
   */
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c],
    e extends keyof T[a][b][c][d],
    f extends keyof T[a][b][c][d][e],
  >(
    key1: a,
    key2: b,
    key3: c,
    key4: d,
    key5: e,
    key6: f
  ): Observable<T[a][b][c][d][e][f]>;
  /**
   * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
   */
  select<
    a extends keyof T,
    b extends keyof T[a],
    c extends keyof T[a][b],
    d extends keyof T[a][b][c],
    e extends keyof T[a][b][c][d],
    f extends keyof T[a][b][c][d][e],
    K = any,
  >(
    key1: a,
    key2: b,
    key3: c,
    key4: d,
    key5: e,
    key6: f,
    ...paths: string[]
  ): Observable<K>;
  /**
   * @deprecated Selectors with props are deprecated, for more info see {@link https://github.com/ngrx/platform/issues/2980 Github Issue}
   */
  select<Props = any, K = any>(
    pathOrMapFn: ((state: T, props?: Props) => K) | string,
    ...paths: string[]
  ): Observable<any> {
    return (select as any).call(null, pathOrMapFn, ...paths)(this);
  }

  /**
   * Returns a signal of the provided selector.
   *
   * @param selector selector function
   * @param options select signal options
   * @returns Signal of the state selected by the provided selector
   * @usageNotes
   *
   * ```ts
   * const count = this.store.selectSignal(state => state.count);
   * ```
   *
   * Or with a selector created by @ngrx/store!createSelector:function
   *
   * ```ts
   * const selectCount = createSelector(
   *  (state: State) => state.count,
   * );
   *
   * const count = this.store.selectSignal(selectCount);
   * ```
   */
  selectSignal<K>(
    selector: (state: T) => K,
    options?: SelectSignalOptions<K>
  ): Signal<K> {
    return computed(() => selector(this.state()), options);
  }

  override lift<R>(operator: Operator<T, R>): Store<R> {
    const store = new Store<R>(this, this.actionsObserver, this.reducerManager);
    store.operator = operator;

    return store;
  }

  dispatch<V extends Action>(action: V & CreatorsNotAllowedCheck<V>): void;
  dispatch<V extends () => Action>(
    dispatchFn: V & CreatorsNotAllowedCheck<V>,
    config?: {
      injector: Injector;
    }
  ): EffectRef;
  dispatch<V extends Action | (() => Action)>(
    actionOrDispatchFn: V,
    config?: { injector?: Injector }
  ): EffectRef | void {
    if (typeof actionOrDispatchFn === 'function') {
      return this.processDispatchFn(actionOrDispatchFn, config);
    }
    this.actionsObserver.next(actionOrDispatchFn);
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

  private processDispatchFn(
    dispatchFn: () => Action,
    config?: { injector?: Injector }
  ) {
    assertDefined(this.injector, 'Store Injector');
    const effectInjector =
      config?.injector ?? getCallerInjector() ?? this.injector;

    return effect(
      () => {
        const action = dispatchFn();
        untracked(() => this.dispatch(action));
      },
      { injector: effectInjector }
    );
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
  c extends keyof T[a][b],
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
  d extends keyof T[a][b][c],
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
  e extends keyof T[a][b][c][d],
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
  f extends keyof T[a][b][c][d][e],
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
  K = any,
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

function getCallerInjector() {
  try {
    return inject(Injector);
  } catch (_) {
    return undefined;
  }
}
