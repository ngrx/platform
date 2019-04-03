import { Inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  Action,
  ActionsSubject,
  INITIAL_STATE,
  ReducerManager,
  Store,
  createSelector,
} from '@ngrx/store';
import { MockState } from './mock_state';
import { MockSelector, MockSelectorWithProps } from './mock_selector';

@Injectable()
export class MockStore<T> extends Store<T> {
  static selectors = new Map<
    string | MockSelector<any, any> | MockSelectorWithProps<any, any, any>,
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
  ): MockSelector<string, Result>;
  overrideSelector<T, Result>(
    selector: MockSelector<T, Result>,
    value: Result
  ): MockSelector<T, Result>;
  overrideSelector<T, Result>(
    selector: MockSelectorWithProps<T, any, Result>,
    value: Result
  ): MockSelectorWithProps<T, any, Result>;
  overrideSelector<T, Result>(
    selector:
      | string
      | MockSelector<any, any>
      | MockSelectorWithProps<any, any, any>,
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
