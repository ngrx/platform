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
import { distinctUntilChanged, map } from 'rxjs/operators';

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

  select<K>(mapFn: (state: T) => K): Observable<K> {
    return (select as any).call(null, mapFn)(this);
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
): (source$: Observable<T>) => Observable<K> {
  return function selectOperator(source$: Observable<T>): Observable<K> {
    return source$.pipe(map(mapFn), distinctUntilChanged());
  };
}

function getCallerInjector() {
  try {
    return inject(Injector);
  } catch (_) {
    return undefined;
  }
}
