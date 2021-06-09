import { createFeature, createReducer, Store, StoreModule } from '@ngrx/store';
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
