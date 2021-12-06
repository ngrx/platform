import { TestBed, ComponentFixture } from '@angular/core/testing';
import { skip, take } from 'rxjs/operators';
import {
  getMockStore,
  MockReducerManager,
  MockState,
  MockStore,
  provideMockStore,
} from '@ngrx/store/testing';
import {
  Store,
  createSelector,
  select,
  StoreModule,
  MemoizedSelector,
  createFeatureSelector,
  isNgrxMockEnvironment,
  INITIAL_STATE,
  ActionsSubject,
  INIT,
  StateObservable,
  ReducerManager,
} from '@ngrx/store';
import { INCREMENT } from '../../spec/fixtures/counter';
import { Component, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { By } from '@angular/platform-browser';

interface TestAppSchema {
  counter1: number;
  counter2: number;
  counter3: number;
  counter4?: number;
}

describe('Mock Store with TestBed', () => {
  let mockStore: MockStore<TestAppSchema>;
  const initialState = { counter1: 0, counter2: 1, counter4: 3 };
  const stringSelector = 'counter4';
  const memoizedSelector = createSelector(
    () => initialState,
    (state) => state.counter4
  );
  const selectorWithPropMocked = createSelector(
    () => initialState,
    (state: typeof initialState, add: number) => state.counter4 + add
  );

  const selectorWithProp = createSelector(
    () => initialState,
    (state: typeof initialState, add: number) => state.counter4 + add
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: stringSelector, value: 87 },
            { selector: memoizedSelector, value: 98 },
            { selector: selectorWithPropMocked, value: 99 },
          ],
        }),
      ],
    });

    mockStore = TestBed.inject(MockStore);
  });

  afterEach(() => {
    memoizedSelector.release();
    selectorWithProp.release();
    selectorWithPropMocked.release();
    mockStore.resetSelectors();
  });

  it('should set NgrxMockEnvironment to true', () => {
    expect(isNgrxMockEnvironment()).toBe(true);
  });

  it('should provide the same instance with Store and MockStore', () => {
    const fromStore = TestBed.inject(Store);
    const fromMockStore = TestBed.inject(MockStore);
    expect(fromStore).toBe(fromMockStore);
  });

  it('should set the initial state to a mocked one', (done: any) => {
    const fixedState = {
      counter1: 17,
      counter2: 11,
      counter3: 25,
    };
    mockStore.setState(fixedState);
    mockStore.pipe(take(1)).subscribe({
      next(val) {
        expect(val).toEqual(fixedState);
      },
      error: done.fail,
      complete: done,
    });
  });

  it('should allow tracing dispatched actions', () => {
    const action = { type: INCREMENT };
    mockStore.scannedActions$
      .pipe(skip(1))
      .subscribe((scannedAction) => expect(scannedAction).toEqual(action));
    mockStore.dispatch(action);
  });

  it('should allow mocking of store.select with string selector using provideMockStore', () => {
    const expectedValue = 87;

    mockStore
      .select(stringSelector)
      .subscribe((result) => expect(result).toBe(expectedValue));
  });

  it('should allow mocking of store.select with a memoized selector using provideMockStore', () => {
    const expectedValue = 98;

    mockStore
      .select(memoizedSelector)
      .subscribe((result) => expect(result).toBe(expectedValue));
  });

  it('should allow mocking of store.pipe(select()) with a memoized selector using provideMockStore', () => {
    const expectedValue = 98;

    mockStore
      .pipe(select(memoizedSelector))
      .subscribe((result) => expect(result).toBe(expectedValue));
  });

  it('should allow mocking of store.select with a memoized selector with Prop using provideMockStore', () => {
    const expectedValue = 99;

    mockStore
      .select(selectorWithPropMocked, 100)
      .subscribe((result) => expect(result).toBe(expectedValue));
  });

  it('should allow mocking of store.pipe(select()) with a memoized selector with Prop using provideMockStore', () => {
    const expectedValue = 99;

    mockStore
      .pipe(select(selectorWithPropMocked, 200))
      .subscribe((result) => expect(result).toBe(expectedValue));
  });

  it('should allow mocking of store.select with string selector using overrideSelector', () => {
    const mockValue = 5;

    mockStore.overrideSelector('counter1', mockValue);

    mockStore
      .select('counter1')
      .subscribe((result) => expect(result).toBe(mockValue));
  });

  it('should allow mocking of store.select with a memoized selector using overrideSelector', () => {
    const mockValue = 5;
    const selector = createSelector(
      () => initialState,
      (state) => state.counter1
    );

    mockStore.overrideSelector(selector, mockValue);

    mockStore
      .select(selector)
      .subscribe((result) => expect(result).toBe(mockValue));
  });

  it('should allow mocking of store.pipe(select()) with a memoized selector using overrideSelector', () => {
    const mockValue = 5;
    const selector = createSelector(
      () => initialState,
      (state) => state.counter2
    );

    mockStore.overrideSelector(selector, mockValue);

    mockStore
      .pipe(select(selector))
      .subscribe((result) => expect(result).toBe(mockValue));
  });

  it('should allow mocking of store.select with a memoized selector with Prop using overrideSelector', () => {
    const mockValue = 100;

    mockStore.overrideSelector(selectorWithProp, mockValue);

    mockStore
      .select(selectorWithProp, 200)
      .subscribe((result) => expect(result).toBe(mockValue));
  });

  it('should allow mocking of store.pipe(select()) with a memoized selector with Prop using overrideSelector', () => {
    const mockValue = 1000;

    mockStore.overrideSelector(selectorWithProp, mockValue);

    mockStore
      .pipe(select(selectorWithProp, 200))
      .subscribe((result) => expect(result).toBe(mockValue));
  });

  it('should pass through unmocked selectors with Props using store.pipe(select())', () => {
    const selectorWithProp = createSelector(
      () => initialState,
      (state: typeof initialState, add: number) => state.counter4 + add
    );

    mockStore
      .pipe(select(selectorWithProp, 6))
      .subscribe((result) => expect(result).toBe(9));
  });

  it('should pass through unmocked selectors with Props using store.select', () => {
    const selectorWithProp = createSelector(
      () => initialState,
      (state: typeof initialState, add: number) => state.counter4 + add
    );

    (mockStore as Store<{}>)
      .select(selectorWithProp, 7)
      .subscribe((result) => expect(result).toBe(10));
  });

  it('should pass through unmocked selectors', () => {
    const mockValue = 5;
    const selector = createSelector(
      () => initialState,
      (state) => state.counter1
    );
    const selector2 = createSelector(
      () => initialState,
      (state) => state.counter2
    );
    const selector3 = createSelector(
      selector,
      selector2,
      (sel1, sel2) => sel1 + sel2
    );

    mockStore.overrideSelector(selector, mockValue);

    mockStore
      .pipe(select(selector2))
      .subscribe((result) => expect(result).toBe(1));
    mockStore
      .pipe(select(selector3))
      .subscribe((result) => expect(result).toBe(6));
  });

  it('should allow you reset mocked selectors', () => {
    const mockValue = 5;
    const selector = createSelector(
      () => initialState,
      (state) => state.counter1
    );
    const selector2 = createSelector(
      () => initialState,
      (state) => state.counter2
    );
    const selector3 = createSelector(
      selector,
      selector2,
      (sel1, sel2) => sel1 + sel2
    );

    mockStore
      .pipe(select(selector3))
      .subscribe((result) => expect(result).toBe(1));

    mockStore.overrideSelector(selector, mockValue);
    mockStore.overrideSelector(selector2, mockValue);
    selector3.release();

    mockStore
      .pipe(select(selector3))
      .subscribe((result) => expect(result).toBe(10));

    mockStore.resetSelectors();
    selector3.release();

    mockStore
      .pipe(select(selector3))
      .subscribe((result) => expect(result).toBe(1));
  });
});

describe('Mock Store with Injector', () => {
  const initialState = { counter: 0 } as const;
  const mockSelector = { selector: 'counter', value: 10 } as const;

  describe('Injector.create', () => {
    let injector: Injector;

    beforeEach(() => {
      injector = Injector.create({
        providers: [
          provideMockStore({ initialState, selectors: [mockSelector] }),
        ],
      });
    });

    it('should set NgrxMockEnvironment to true', () => {
      expect(isNgrxMockEnvironment()).toBe(true);
    });

    it('should provide Store', (done: any) => {
      const store: Store<typeof initialState> = injector.get(Store);

      store.pipe(take(1)).subscribe((state) => {
        expect(state).toBe(initialState);
        done();
      });
    });

    it('should provide MockStore', (done: any) => {
      const mockStore: MockStore<typeof initialState> = injector.get(MockStore);

      mockStore.pipe(take(1)).subscribe((state) => {
        expect(state).toBe(initialState);
        done();
      });
    });

    it('should provide the same instance for Store and MockStore', () => {
      const store: Store<typeof initialState> = injector.get(Store);
      const mockStore: MockStore<typeof initialState> = injector.get(MockStore);

      expect(store).toBe(mockStore);
    });

    it('should use a mock selector', (done: any) => {
      const mockStore: MockStore<typeof initialState> = injector.get(MockStore);

      mockStore
        .select(mockSelector.selector)
        .pipe(take(1))
        .subscribe((selectedValue) => {
          expect(selectedValue).toBe(mockSelector.value);
          done();
        });
    });

    it('should provide INITIAL_STATE', () => {
      const providedInitialState = injector.get(INITIAL_STATE);

      expect(providedInitialState).toBe(initialState);
    });

    it('should provide ActionsSubject', (done: any) => {
      const actionsSubject = injector.get(ActionsSubject);

      actionsSubject.pipe(take(1)).subscribe((action) => {
        expect(action.type).toBe(INIT);
        done();
      });
    });

    it('should provide MockState', (done: any) => {
      const mockState: MockState<typeof initialState> = injector.get(MockState);

      mockState.pipe(take(1)).subscribe((state) => {
        expect(state).toEqual({});
        done();
      });
    });

    it('should provide StateObservable', (done: any) => {
      const stateObservable = injector.get(StateObservable);

      stateObservable.pipe(take(1)).subscribe((state) => {
        expect(state).toEqual({});
        done();
      });
    });

    it('should provide the same instance for MockState and StateObservable', () => {
      const mockState: MockState<typeof initialState> = injector.get(MockState);
      const stateObservable: StateObservable = injector.get(StateObservable);

      expect(mockState).toBe(stateObservable);
    });

    it('should provide ReducerManager', () => {
      const reducerManager = injector.get(ReducerManager);

      expect(reducerManager.addFeature).toBeInstanceOf(Function);
      expect(reducerManager.addFeatures).toBeInstanceOf(Function);
    });

    it('should provide MockReducerManager', () => {
      const mockReducerManager = injector.get(MockReducerManager);

      expect(mockReducerManager.addFeature).toBeInstanceOf(Function);
      expect(mockReducerManager.addFeatures).toBeInstanceOf(Function);
    });

    it('should provide the same instance for ReducerManager and MockReducerManager', () => {
      const reducerManager = injector.get(ReducerManager);
      const mockReducerManager = injector.get(MockReducerManager);

      expect(reducerManager).toBe(mockReducerManager);
    });
  });

  describe('getMockStore', () => {
    let mockStore: MockStore<typeof initialState>;

    beforeEach(() => {
      mockStore = getMockStore({ initialState, selectors: [mockSelector] });
    });

    it('should create MockStore', (done: any) => {
      mockStore.pipe(take(1)).subscribe((state) => {
        expect(state).toBe(initialState);
        done();
      });
    });

    it('should use a mock selector', (done: any) => {
      mockStore
        .select(mockSelector.selector)
        .pipe(take(1))
        .subscribe((selectedValue) => {
          expect(selectedValue).toBe(mockSelector.value);
          done();
        });
    });
  });
});

describe('Refreshing state', () => {
  type TodoState = {
    items: { name: string; done: boolean }[];
  };
  const selectTodosState = createFeatureSelector<TodoState>('todos');
  const todos = createSelector(selectTodosState, (todos) => todos.items);
  const getTodoItems = (elSelector: string) =>
    fixture.debugElement.queryAll(By.css(elSelector));
  let mockStore: MockStore<TodoState>;
  let mockSelector: MemoizedSelector<TodoState, any[]>;
  const initialTodos = [{ name: 'aaa', done: false }];
  let fixture: ComponentFixture<TodosComponent>;

  @Component({
    selector: 'ngrx-app-todos',
    template: `
      <ul>
        <li *ngFor="let todo of todos | async">
          {{ todo.name }} <input type="checkbox" [checked]="todo.done" />
        </li>

        <p *ngFor="let todo of todosSelect | async">
          {{ todo.name }} <input type="checkbox" [checked]="todo.done" />
        </p>
      </ul>
    `,
  })
  class TodosComponent {
    todos: Observable<any[]> = this.store.pipe(select(todos));
    todosSelect: Observable<any[]> = this.store.select(todos);

    constructor(private store: Store<{}>) {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodosComponent],
      providers: [provideMockStore()],
    }).compileComponents();

    mockStore = TestBed.inject(MockStore);
    mockSelector = mockStore.overrideSelector(todos, initialTodos);

    fixture = TestBed.createComponent(TodosComponent);
    fixture.detectChanges();
  });

  it('should work with store and select operator', () => {
    const newTodos = [{ name: 'bbb', done: true }];
    mockSelector.setResult(newTodos);
    mockStore.refreshState();

    fixture.detectChanges();

    expect(getTodoItems('li').length).toBe(1);
    expect(getTodoItems('li')[0].nativeElement.textContent.trim()).toBe('bbb');
  });

  it('should work with store.select method', () => {
    const newTodos = [{ name: 'bbb', done: true }];
    mockSelector.setResult(newTodos);
    mockStore.refreshState();

    fixture.detectChanges();

    expect(getTodoItems('p').length).toBe(1);
    expect(getTodoItems('p')[0].nativeElement.textContent.trim()).toBe('bbb');
  });

  it('should work with overrideSelector twice', () => {
    const newTodos = [{ name: 'bbb', done: true }];
    mockStore.overrideSelector(todos, newTodos);
    mockStore.refreshState();

    fixture.detectChanges();

    expect(getTodoItems('li').length).toBe(1);
    expect(getTodoItems('li')[0].nativeElement.textContent.trim()).toBe('bbb');
  });
});
