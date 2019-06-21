import { TestBed } from '@angular/core/testing';
import { INCREMENT } from '../../spec/fixtures/counter';
import { skip, take } from 'rxjs/operators';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store, createSelector, select } from '@ngrx/store';

interface TestAppSchema {
  counter1: number;
  counter2: number;
  counter3: number;
  counter4?: number;
}

describe('Mock Store', () => {
  let mockStore: MockStore<TestAppSchema>;
  const initialState = { counter1: 0, counter2: 1, counter4: 3 };
  const stringSelector = 'counter4';
  const memoizedSelector = createSelector(
    () => initialState,
    state => state.counter4
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

    mockStore = TestBed.get(Store);
  });

  afterEach(() => {
    memoizedSelector.release();
    selectorWithProp.release();
    selectorWithPropMocked.release();
    mockStore.resetSelectors();
  });

  it('should set the initial state to a mocked one', (done: DoneFn) => {
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
      .subscribe(scannedAction => expect(scannedAction).toEqual(action));
    mockStore.dispatch(action);
  });

  it('should allow mocking of store.select with string selector using provideMockStore', () => {
    const expectedValue = 87;

    mockStore
      .select(stringSelector)
      .subscribe(result => expect(result).toBe(expectedValue));
  });

  it('should allow mocking of store.select with a memoized selector using provideMockStore', () => {
    const expectedValue = 98;

    mockStore
      .select(memoizedSelector)
      .subscribe(result => expect(result).toBe(expectedValue));
  });

  it('should allow mocking of store.pipe(select()) with a memoized selector using provideMockStore', () => {
    const expectedValue = 98;

    mockStore
      .pipe(select(memoizedSelector))
      .subscribe(result => expect(result).toBe(expectedValue));
  });

  it('should allow mocking of store.select with a memoized selector with Prop using provideMockStore', () => {
    const expectedValue = 99;

    mockStore
      .select(selectorWithPropMocked, 100)
      .subscribe(result => expect(result).toBe(expectedValue));
  });

  it('should allow mocking of store.pipe(select()) with a memoized selector with Prop using provideMockStore', () => {
    const expectedValue = 99;

    mockStore
      .pipe(select(selectorWithPropMocked, 200))
      .subscribe(result => expect(result).toBe(expectedValue));
  });

  it('should allow mocking of store.select with string selector using overrideSelector', () => {
    const mockValue = 5;

    mockStore.overrideSelector('counter1', mockValue);

    mockStore
      .select('counter1')
      .subscribe(result => expect(result).toBe(mockValue));
  });

  it('should allow mocking of store.select with a memoized selector using overrideSelector', () => {
    const mockValue = 5;
    const selector = createSelector(
      () => initialState,
      state => state.counter1
    );

    mockStore.overrideSelector(selector, mockValue);

    mockStore
      .select(selector)
      .subscribe(result => expect(result).toBe(mockValue));
  });

  it('should allow mocking of store.pipe(select()) with a memoized selector using overrideSelector', () => {
    const mockValue = 5;
    const selector = createSelector(
      () => initialState,
      state => state.counter2
    );

    mockStore.overrideSelector(selector, mockValue);

    mockStore
      .pipe(select(selector))
      .subscribe(result => expect(result).toBe(mockValue));
  });

  it('should allow mocking of store.select with a memoized selector with Prop using overrideSelector', () => {
    const mockValue = 100;

    mockStore.overrideSelector(selectorWithProp, mockValue);

    mockStore
      .select(selectorWithProp, 200)
      .subscribe(result => expect(result).toBe(mockValue));
  });

  it('should allow mocking of store.pipe(select()) with a memoized selector with Prop using overrideSelector', () => {
    const mockValue = 1000;

    mockStore.overrideSelector(selectorWithProp, mockValue);

    mockStore
      .pipe(select(selectorWithProp, 200))
      .subscribe(result => expect(result).toBe(mockValue));
  });

  it('should pass through unmocked selectors with Props using store.pipe(select())', () => {
    const selectorWithProp = createSelector(
      () => initialState,
      (state: typeof initialState, add: number) => state.counter4 + add
    );

    mockStore
      .pipe(select(selectorWithProp, 6))
      .subscribe(result => expect(result).toBe(9));
  });

  it('should pass through unmocked selectors with Props using store.select', () => {
    const selectorWithProp = createSelector(
      () => initialState,
      (state: typeof initialState, add: number) => state.counter4 + add
    );

    (mockStore as Store<{}>)
      .select(selectorWithProp, 7)
      .subscribe(result => expect(result).toBe(10));
  });

  it('should pass through unmocked selectors', () => {
    const mockValue = 5;
    const selector = createSelector(
      () => initialState,
      state => state.counter1
    );
    const selector2 = createSelector(
      () => initialState,
      state => state.counter2
    );
    const selector3 = createSelector(
      selector,
      selector2,
      (sel1, sel2) => sel1 + sel2
    );

    mockStore.overrideSelector(selector, mockValue);

    mockStore
      .pipe(select(selector2))
      .subscribe(result => expect(result).toBe(1));
    mockStore
      .pipe(select(selector3))
      .subscribe(result => expect(result).toBe(6));
  });

  it('should allow you reset mocked selectors', () => {
    const mockValue = 5;
    const selector = createSelector(
      () => initialState,
      state => state.counter1
    );
    const selector2 = createSelector(
      () => initialState,
      state => state.counter2
    );
    const selector3 = createSelector(
      selector,
      selector2,
      (sel1, sel2) => sel1 + sel2
    );

    mockStore
      .pipe(select(selector3))
      .subscribe(result => expect(result).toBe(1));

    mockStore.overrideSelector(selector, mockValue);
    mockStore.overrideSelector(selector2, mockValue);
    selector3.release();

    mockStore
      .pipe(select(selector3))
      .subscribe(result => expect(result).toBe(10));

    mockStore.resetSelectors();
    selector3.release();

    mockStore
      .pipe(select(selector3))
      .subscribe(result => expect(result).toBe(1));
  });
});
