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
      const store = TestBed.inject(Store) as Store<any> | undefined;
      if (store && typeof (store as MockStore).resetSelectors === 'function') {
        (store as MockStore).resetSelectors();
      }
    } catch {}
  });
}

type OnlyMemoized<T, Result> = T extends string
  ? MemoizedSelector<any, Result>
  : T;

@Injectable()
export class MockStore<T = object> extends Store<T> {
  private readonly selectors = new Map<
    | string
    | MemoizedSelector<any, any>
    | MemoizedSelectorWithProps<any, any, any>,
    any
  >();

  readonly scannedActions$: Observable<Action>;
  private lastState?: T;

  constructor(
    private state$: MockState<T>,
    actionsObserver: ActionsSubject,
    reducerManager: ReducerManager,
    @Inject(INITIAL_STATE) private initialState: T,
    @Inject(MOCK_SELECTORS) mockSelectors: MockSelector[] = []
  ) {
    super(state$, actionsObserver, reducerManager);
    this.resetSelectors();
    this.setState(this.initialState);
    this.scannedActions$ = actionsObserver.asObservable();
    for (const mockSelector of mockSelectors) {
      this.overrideSelector(mockSelector.selector, mockSelector.value);
    }
  }

  setState(nextState: T): void {
    this.state$.next(nextState);
    this.lastState = nextState;
  }

  overrideSelector<
    Result,
    Memoized extends
      | MemoizedSelector<any, Result>
      | MemoizedSelectorWithProps<any, any, Result>
  >(
    selector: Memoized | string,
    value: Result
  ): OnlyMemoized<typeof selector, Result> {
    this.selectors.set(selector, value);

    if (typeof selector === 'string') {
      const stringSelector = createSelector(() => {}, () => value);
      return stringSelector;
    }
    selector.setResult(value);

    return selector as OnlyMemoized<typeof selector, Result>;
  }

  resetSelectors() {
    for (const selector of this.selectors.keys()) {
      if (typeof selector !== 'string') {
        selector.release();
        selector.clearResult();
      }
    }

    this.selectors.clear();
  }

  select(selector: any, prop?: any) {
    if (typeof selector === 'string' && this.selectors.has(selector)) {
      return new BehaviorSubject<any>(
        this.selectors.get(selector)
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
    if (this.lastState) this.setState({ ...this.lastState });
  }
}
