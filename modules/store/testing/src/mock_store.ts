import { Inject, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  Action,
  ActionsSubject,
  INITIAL_STATE,
  ReducerManager,
  Store,
  createSelector,
  MemoizedSelectorWithProps,
  MemoizedSelector,
} from '@ngrx/store';
import { MockState } from './mock_state';
import { MockSelector } from './mock_selector';
import { MOCK_SELECTORS } from './tokens';

if (typeof afterEach === 'function') {
  afterEach(() => {
    try {
      const store = TestBed.get(Store) as MockStore<any>;
      if (store && 'resetSelectors' in store) {
        store.resetSelectors();
      }
    } catch {}
  });
}

@Injectable()
export class MockStore<T> extends Store<T> {
  static selectors = new Map<
    | string
    | MemoizedSelector<any, any>
    | MemoizedSelectorWithProps<any, any, any>,
    any
  >();

  public scannedActions$: Observable<Action>;
  private lastState: T;

  constructor(
    private state$: MockState<T>,
    actionsObserver: ActionsSubject,
    reducerManager: ReducerManager,
    @Inject(INITIAL_STATE) private initialState: T,
    @Inject(MOCK_SELECTORS) mockSelectors?: MockSelector[]
  ) {
    super(state$, actionsObserver, reducerManager);
    this.resetSelectors();
    this.setState(this.initialState);
    this.scannedActions$ = actionsObserver.asObservable();
    if (mockSelectors) {
      mockSelectors.forEach(mockSelector => {
        const selector = mockSelector.selector;
        if (typeof selector === 'string') {
          this.overrideSelector(selector, mockSelector.value);
        } else {
          this.overrideSelector(selector, mockSelector.value);
        }
      });
    }
  }

  setState(nextState: T): void {
    this.state$.next(nextState);
    this.lastState = nextState;
  }

  overrideSelector<T, Result>(
    selector: string,
    value: Result
  ): MemoizedSelector<string, Result>;
  overrideSelector<T, Result>(
    selector: MemoizedSelector<T, Result>,
    value: Result
  ): MemoizedSelector<T, Result>;
  overrideSelector<T, Result>(
    selector: MemoizedSelectorWithProps<T, any, Result>,
    value: Result
  ): MemoizedSelectorWithProps<T, any, Result>;
  overrideSelector<T, Result>(
    selector:
      | string
      | MemoizedSelector<any, any>
      | MemoizedSelectorWithProps<any, any, any>,
    value: any
  ) {
    MockStore.selectors.set(selector, value);

    if (typeof selector === 'string') {
      const stringSelector = createSelector(() => {}, () => value);

      return stringSelector;
    }

    selector.setResult(value);

    return selector;
  }

  resetSelectors() {
    MockStore.selectors.forEach((_, selector) => {
      if (typeof selector !== 'string') {
        selector.release();
        selector.setResult();
      }
    });

    MockStore.selectors.clear();
  }

  select(selector: any, prop?: any) {
    if (typeof selector === 'string' && MockStore.selectors.has(selector)) {
      return new BehaviorSubject<any>(
        MockStore.selectors.get(selector)
      ).asObservable();
    }

    return super.select(selector, prop);
  }

  addReducer() {
    /* noop */
  }

  removeReducer() {
    /* noop */
  }

  /**
   * Refreshes the existing state.
   */
  refreshState() {
    this.setState({ ...(this.lastState as T) });
  }
}
