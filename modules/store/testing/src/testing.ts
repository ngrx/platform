import { Provider } from '@angular/core';
import { MockState } from './mock_state';
import {
  ActionsSubject,
  INITIAL_STATE,
  ReducerManager,
  StateObservable,
  Store,
  setNgrxMockEnvironment,
} from '@ngrx/store';
import { MockStore } from './mock_store';
import { MockReducerManager } from './mock_reducer_manager';
import { MockSelector } from './mock_selector';
import { MOCK_SELECTORS } from './tokens';

export interface MockStoreConfig<T> {
  initialState?: T;
  selectors?: MockSelector[];
}

export function provideMockStore<T = any>(
  config: MockStoreConfig<T> = {}
): Provider[] {
  setNgrxMockEnvironment(true);
  return [
    ActionsSubject,
    MockState,
    MockStore,
    { provide: INITIAL_STATE, useValue: config.initialState || {} },
    { provide: MOCK_SELECTORS, useValue: config.selectors },
    { provide: StateObservable, useClass: MockState },
    { provide: ReducerManager, useClass: MockReducerManager },
    { provide: Store, useExisting: MockStore },
  ];
}

export { MockReducerManager } from './mock_reducer_manager';
export { MockState } from './mock_state';
export { MockStore } from './mock_store';
export { MockSelector } from './mock_selector';
