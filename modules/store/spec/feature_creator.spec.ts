import {
  createFeature,
  createReducer,
  createSelector,
  Store,
  StoreModule,
} from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

describe('createFeature()', () => {
  it('should return passed name and reducer', () => {
    const fooName = 'foo';
    const fooReducer = createReducer(0);

    const { name, reducer } = createFeature({
      name: fooName,
      reducer: fooReducer,
    });

    expect(name).toBe(fooName);
    expect(reducer).toBe(fooReducer);
  });

  it('should create a feature selector', () => {
    const { selectFooState } = createFeature({
      name: 'foo',
      reducer: createReducer({ bar: '' }),
    });

    expect(selectFooState({ foo: { bar: 'baz' } })).toEqual({ bar: 'baz' });
  });

  describe('nested selectors', () => {
    it('should create when feature state is a dictionary', () => {
      const initialState = { alpha: 123, beta: { bar: 'baz' }, gamma: false };

      const { selectAlpha, selectBeta, selectGamma } = createFeature({
        name: 'foo',
        reducer: createReducer(initialState),
      });

      expect(selectAlpha({ foo: initialState })).toEqual(123);
      expect(selectBeta({ foo: initialState })).toEqual({ bar: 'baz' });
      expect(selectGamma({ foo: initialState })).toEqual(false);
    });

    it('should return undefined when feature state is not defined', () => {
      const { selectX } = createFeature({
        name: 'foo',
        reducer: createReducer({ x: 'y' }),
      });

      expect(selectX({})).toBe(undefined);
    });

    it('should not create when feature state is a primitive value', () => {
      const feature = createFeature({ name: 'foo', reducer: createReducer(0) });

      expect(Object.keys(feature)).toEqual([
        'name',
        'reducer',
        'selectFooState',
      ]);
    });

    it('should not create when feature state is null', () => {
      const feature = createFeature({
        name: 'foo',
        reducer: createReducer(null),
      });

      expect(Object.keys(feature)).toEqual([
        'name',
        'reducer',
        'selectFooState',
      ]);
    });

    it('should not create when feature state is an array', () => {
      const feature = createFeature({
        name: 'foo',
        reducer: createReducer([1, 2, 3]),
      });

      expect(Object.keys(feature)).toEqual([
        'name',
        'reducer',
        'selectFooState',
      ]);
    });

    it('should not create when feature state is a date object', () => {
      const feature = createFeature({
        name: 'foo',
        reducer: createReducer(new Date()),
      });

      expect(Object.keys(feature)).toEqual([
        'name',
        'reducer',
        'selectFooState',
      ]);
    });
  });

  describe('extra selectors', () => {
    it('should create extra selectors', () => {
      const initialState = { count1: 9, count2: 10 };
      const counterFeature = createFeature({
        name: 'counter',
        reducer: createReducer(initialState),
        extraSelectors: ({
          selectCounterState,
          selectCount1,
          selectCount2,
        }) => ({
          selectSquaredCount2: createSelector(
            selectCounterState,
            ({ count2 }) => count2 * count2
          ),
          selectTotalCount: createSelector(
            selectCount1,
            selectCount2,
            (count1, count2) => count1 + count2
          ),
          selectCount3: (count: number) =>
            createSelector(
              selectCount1,
              selectCount2,
              (count1, count2) => count1 + count2 + count
            ),
        }),
      });

      expect(counterFeature.selectCounterState({ counter: initialState })).toBe(
        initialState
      );
      expect(counterFeature.selectCount1({ counter: initialState })).toBe(
        initialState.count1
      );
      expect(counterFeature.selectCount2({ counter: initialState })).toBe(
        initialState.count2
      );
      expect(
        counterFeature.selectSquaredCount2({ counter: initialState })
      ).toBe(initialState.count2 * initialState.count2);
      expect(counterFeature.selectTotalCount({ counter: initialState })).toBe(
        initialState.count1 + initialState.count2
      );
      expect(counterFeature.selectCount3(1)({ counter: initialState })).toBe(
        initialState.count1 + initialState.count2 + 1
      );
      expect(Object.keys(counterFeature)).toEqual([
        'name',
        'reducer',
        'selectCounterState',
        'selectCount1',
        'selectCount2',
        'selectSquaredCount2',
        'selectTotalCount',
        'selectCount3',
      ]);
    });

    it('should override base selectors if extra selectors have the same names', () => {
      const initialState = { count1: 10, count2: 100 };
      const counterFeature = createFeature({
        name: 'counter',
        reducer: createReducer(initialState),
        extraSelectors: ({
          selectCounterState,
          selectCount1,
          selectCount2,
        }) => ({
          selectCounterState: createSelector(
            selectCounterState,
            ({ count1, count2 }) => `ngrx-${count1}-${count2}`
          ),
          selectCount2: createSelector(
            selectCount2,
            (count2) => `ngrx-${count2}`
          ),
          selectTotalCount: createSelector(
            selectCount1,
            selectCount2,
            (count1, count2) => count1 + count2
          ),
        }),
      });

      expect(counterFeature.selectCounterState({ counter: initialState })).toBe(
        `ngrx-${initialState.count1}-${initialState.count2}`
      );
      expect(counterFeature.selectCount1({ counter: initialState })).toBe(
        initialState.count1
      );
      expect(counterFeature.selectCount2({ counter: initialState })).toBe(
        `ngrx-${initialState.count2}`
      );
      expect(counterFeature.selectTotalCount({ counter: initialState })).toBe(
        initialState.count1 + initialState.count2
      );
      expect(Object.keys(counterFeature)).toEqual([
        'name',
        'reducer',
        'selectCounterState',
        'selectCount1',
        'selectCount2',
        'selectTotalCount',
      ]);
    });
  });

  it('should set up a feature state', (done) => {
    const initialFooState = { x: 1, y: 2, z: 3 };
    const fooFeature = createFeature({
      name: 'foo',
      reducer: createReducer(initialFooState),
    });

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), StoreModule.forFeature(fooFeature)],
    });

    TestBed.inject(Store)
      .select(fooFeature.name)
      .pipe(take(1))
      .subscribe((fooState) => {
        expect(fooState).toEqual(initialFooState);
        done();
      });
  });
});
