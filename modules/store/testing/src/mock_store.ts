import { Inject, Injectable } from '@angular/core';
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

type OnlyMemoized<T, Result> = T extends string | MemoizedSelector<any, any>
  ? MemoizedSelector<any, Result>
  : T extends MemoizedSelectorWithProps<any, any, any>
  ? MemoizedSelectorWithProps<any, any, Result>
  : never;

type Memoized<Result> =
  | MemoizedSelector<any, Result>
  | MemoizedSelectorWithProps<any, any, Result>;

@Injectable()
export class MockStore<T = object> extends Store<T> {
  private readonly selectors = new Map<Memoized<any> | string, any>();

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
    Selector extends Memoized<Result>,
    Value extends Result,
    Result = Selector extends MemoizedSelector<any, infer T>
      ? T
      : Selector extends MemoizedSelectorWithProps<any, any, infer U>
      ? U
      : Value
  >(
    selector: Selector | string,
    value: Value
  ): OnlyMemoized<typeof selector, Result> {
    this.selectors.set(selector, value);

    const resultSelector: Memoized<Result> =
      typeof selector === 'string'
        ? createSelector(
            () => {},
            (): Result => value
          )
        : selector;

    resultSelector.setResult(value);

    return resultSelector as OnlyMemoized<typeof selector, Result>;
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

  override select(selector: any, prop?: any) {
    if (typeof selector === 'string' && this.selectors.has(selector)) {
      return new BehaviorSubject<any>(
        this.selectors.get(selector)
      ).asObservable();
    }

    return super.select(selector, prop);
  }

  override addReducer() {
    /* noop */
  }

  override removeReducer() {
    /* noop */
  }

  /**
   * Refreshes the existing state.
   */
  refreshState() {
    if (this.lastState) this.setState({ ...this.lastState });
  }
}
