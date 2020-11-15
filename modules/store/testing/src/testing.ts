import {
  ExistingProvider,
  FactoryProvider,
  Injector,
  ValueProvider,
} from '@angular/core';
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

/**
 * @description
 * Creates mock store providers.
 *
 * @param config `MockStoreConfig<T>` to provide the values for `INITIAL_STATE` and `MOCK_SELECTORS` tokens.
 * By default, `initialState` and `selectors` are not defined.
 * @returns Mock store providers that can be used with both `TestBed.configureTestingModule` and `Injector.create`.
 *
 * @usageNotes
 *
 * **With `TestBed.configureTestingModule`**
 *
 * ```typescript
 * describe('Books Component', () => {
 *   let store: MockStore;
 *
 *   beforeEach(() => {
 *     TestBed.configureTestingModule({
 *       providers: [
 *         provideMockStore({
 *           initialState: { books: { entities: [] } },
 *           selectors: [
 *             { selector: selectAllBooks, value: ['Book 1', 'Book 2'] },
 *             { selector: selectVisibleBooks, value: ['Book 1'] },
 *           ],
 *         }),
 *       ],
 *     });
 *
 *     store = TestBed.inject(MockStore);
 *   });
 * });
 * ```
 *
 * **With `Injector.create`**
 *
 * ```typescript
 * describe('Counter Component', () => {
 *   let injector: Injector;
 *   let store: MockStore;
 *
 *   beforeEach(() => {
 *     injector = Injector.create({
 *       providers: [
 *         provideMockStore({ initialState: { counter: 0 } }),
 *       ],
 *     });
 *     store = injector.get(MockStore);
 *   });
 * });
 * ```
 */
export function provideMockStore<T = any>(
  config: MockStoreConfig<T> = {}
): (ValueProvider | ExistingProvider | FactoryProvider)[] {
  setNgrxMockEnvironment(true);
  return [
    {
      provide: ActionsSubject,
      useFactory: () => new ActionsSubject(),
      deps: [],
    },
    { provide: MockState, useFactory: () => new MockState<T>(), deps: [] },
    {
      provide: MockReducerManager,
      useFactory: () => new MockReducerManager(),
      deps: [],
    },
    { provide: INITIAL_STATE, useValue: config.initialState || {} },
    { provide: MOCK_SELECTORS, useValue: config.selectors },
    { provide: StateObservable, useExisting: MockState },
    { provide: ReducerManager, useExisting: MockReducerManager },
    {
      provide: MockStore,
      useFactory: mockStoreFactory,
      deps: [
        MockState,
        ActionsSubject,
        ReducerManager,
        INITIAL_STATE,
        MOCK_SELECTORS,
      ],
    },
    { provide: Store, useExisting: MockStore },
  ];
}

function mockStoreFactory<T>(
  mockState: MockState<T>,
  actionsSubject: ActionsSubject,
  reducerManager: ReducerManager,
  initialState: T,
  mockSelectors: MockSelector[]
): MockStore<T> {
  return new MockStore(
    mockState,
    actionsSubject,
    reducerManager,
    initialState,
    mockSelectors
  );
}

/**
 * @description
 * Creates mock store with all necessary dependencies outside of the `TestBed`.
 *
 * @param config `MockStoreConfig<T>` to provide the values for `INITIAL_STATE` and `MOCK_SELECTORS` tokens.
 * By default, `initialState` and `selectors` are not defined.
 * @returns `MockStore<T>`
 *
 * @usageNotes
 *
 * ```typescript
 * describe('Books Effects', () => {
 *   let store: MockStore;
 *
 *   beforeEach(() => {
 *     store = getMockStore({
 *       initialState: { books: { entities: ['Book 1', 'Book 2', 'Book 3'] } },
 *       selectors: [
 *         { selector: selectAllBooks, value: ['Book 1', 'Book 2'] },
 *         { selector: selectVisibleBooks, value: ['Book 1'] },
 *       ],
 *     });
 *   });
 * });
 * ```
 */
export function getMockStore<T>(config: MockStoreConfig<T> = {}): MockStore<T> {
  const injector = Injector.create({ providers: provideMockStore(config) });
  return injector.get(MockStore);
}

export { MockReducerManager } from './mock_reducer_manager';
export { MockState } from './mock_state';
export { MockStore } from './mock_store';
export { MockSelector } from './mock_selector';
