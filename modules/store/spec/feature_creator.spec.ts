import {
  createAction,
  createFeature,
  createReducer,
  Feature,
  on,
} from '@ngrx/store';

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

  it('should create feature selector', () => {
    const { selectFooState } = createFeature({
      name: 'foo',
      reducer: createReducer({ bar: '' }),
    });

    expect(selectFooState({ foo: { bar: 'baz' } })).toEqual({ bar: 'baz' });
  });

  describe('nested selectors', () => {
    function setup<FeatureState>(
      initialState: FeatureState
    ): Feature<{ foo: FeatureState }, 'foo', FeatureState> {
      const a1 = createAction('a1');
      const reducer = createReducer(
        initialState,
        on(a1, (state) => state)
      );

      return createFeature({ name: 'foo', reducer });
    }

    it('should create when feature state is a dictionary', () => {
      const initialState = { alpha: 123, beta: { bar: 'baz' }, gamma: false };

      const { selectAlpha, selectBeta, selectGamma } = setup(initialState);

      expect(selectAlpha({ foo: initialState })).toEqual(123);
      expect(selectBeta({ foo: initialState })).toEqual({ bar: 'baz' });
      expect(selectGamma({ foo: initialState })).toEqual(false);
    });

    it('should not create when feature state is a primitive value', () => {
      const feature = setup(0);

      expect(Object.keys(feature)).toEqual([
        'name',
        'reducer',
        'selectFooState',
      ]);
    });

    it('should not create when feature state is an array', () => {
      const feature = setup([1, 2, 3]);

      expect(Object.keys(feature)).toEqual([
        'name',
        'reducer',
        'selectFooState',
      ]);
    });

    it('should not create when feature state is a date object', () => {
      const feature = setup(new Date());

      expect(Object.keys(feature)).toEqual([
        'name',
        'reducer',
        'selectFooState',
      ]);
    });
  });
});
