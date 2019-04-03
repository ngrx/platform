import { Provider } from '@angular/core';
import { MockState } from './mock_state';
import {
  ActionsSubject,
  INITIAL_STATE,
  ReducerManager,
  StateObservable,
  Store,
} from '@ngrx/store';
import { MockStore } from './mock_store';
import { MockReducerManager } from './mock_reducer_manager';

export interface MockStoreConfig<T> {
  initialState?: T;
}

export function provideMockStore<T = any>(
  config: MockStoreConfig<T> = {}
): Provider[] {
  return [
    ActionsSubject,
    MockState,
    { provide: INITIAL_STATE, useValue: config.initialState },
    { provide: StateObservable, useClass: MockState },
    { provide: ReducerManager, useClass: MockReducerManager },
    { provide: Store, useClass: MockStore },
  ];
}

export { MockReducerManager } from './mock_reducer_manager';
export { MockState } from './mock_state';
export { MockStore } from './mock_store';
