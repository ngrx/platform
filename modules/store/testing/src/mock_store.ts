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

@Injectable()
export class MockStore<T> extends Store<T> {
  static selectors = new Map<
    | string
    | MemoizedSelector<any, any>
    | MemoizedSelectorWithProps<any, any, any>,
    any
  >();

  public scannedActions$: Observable<Action>;

  constructor(
    private state$: MockState<T>,
    actionsObserver: ActionsSubject,
    reducerManager: ReducerManager,
    @Inject(INITIAL_STATE) private initialState: T
  ) {
    super(state$, actionsObserver, reducerManager);
    this.resetSelectors();
    this.state$.next(this.initialState);
    this.scannedActions$ = actionsObserver.asObservable();
  }

  setState(nextState: T): void {
    this.state$.next(nextState);
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

  select(selector: any) {
    if (MockStore.selectors.has(selector)) {
      return new BehaviorSubject<any>(
        MockStore.selectors.get(selector)
      ).asObservable();
    }

    return super.select(selector);
  }

  addReducer() {
    /* noop */
  }

  removeReducer() {
    /* noop */
  }
}
