import { omit } from '../src/utils';
import {
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  compose,
  createReducerFactory,
} from '@ngrx/store';

describe(`Store utils`, () => {
  describe(`combineReducers()`, () => {
    const state1 = { x: '' };
    const state2 = { y: '' };
    const reducer1 = (state = state1, action: any): typeof state1 =>
      action.type === 'state1' ? { ...state, x: action.payload } : state;
    const reducer2 = (state = state2, action: any): typeof state2 =>
      action.type === 'state2' ? { ...state, y: action.payload } : state;
    const reducers = { reducer1, reducer2, extraneous: true };
    const initialState = { reducer1: { x: 'foo' }, reducer2: { y: 'bar' } };

    let combination: any;

    beforeEach(() => {
      combination = combineReducers(reducers, initialState);
    });

    it(`should ignore extraneous keys`, () => {
      expect(combination(undefined, { type: '' }).extraneous).toBeUndefined();
    });

    it(`should create a function that accepts state and action and returns combined state object`, () => {
      const updateAction1 = { type: 'state1', payload: 'baz' };
      expect(combination(initialState, updateAction1)).toEqual({
        ...initialState,
        reducer1: { x: updateAction1.payload },
      });
    });

    it(`should handle initialState`, () => {
      expect(combination(undefined, { type: '' })).toEqual(initialState);
    });

    it(`should return original state if nothing changed`, () => {
      expect(combination(initialState, { type: '' })).toBe(initialState);
    });
  });

  describe(`omit()`, () => {
    let originalObj: { x: string; y: string; z?: string };

    beforeEach(() => {
      originalObj = { x: 'foo', y: 'bar' };
    });

    it(`should omit a key passed`, () => {
      expect(omit(originalObj, 'x')).toEqual({ y: 'bar' });
    });

    it(`should not modify the original object`, () => {
      expect(omit(originalObj, 'y')).not.toBe(originalObj);
    });
  });

  describe(`compose()`, () => {
    const cube = (n: number) => Math.pow(n, 3);
    const precision = (n: number) => parseFloat(n.toPrecision(12));
    const addPtTwo = (n: number) => n + 0.2;

    it(`should should compose functions`, () => {
      const addPrecision = compose(precision, addPtTwo);
      const addPrecisionCubed = compose(cube, addPrecision);

      expect(addPrecision(0.1)).toBe(0.3);
      expect(addPrecisionCubed(0.1)).toBe(0.027);
    });

    it(`should act as identity if no functions passed`, () => {
      const id = compose();
      expect(id(1)).toBe(1);
    });
  });

  describe(`createReducerFactory()`, () => {
    const fruitReducer = (state: string = 'banana', action: any) =>
      action.type === 'fruit' ? action.payload : state;
    type FruitState = { fruit: string };
    const reducerMap: ActionReducerMap<FruitState> = { fruit: fruitReducer };
    const initialState: FruitState = { fruit: 'apple' };

    const runWithExpectations = (
      metaReducers: any[],
      initialState: any,
      expectedState: any
    ) => () => {
      let spiedFactory: jasmine.Spy;
      let reducer: ActionReducer<FruitState>;
      beforeEach(() => {
        spiedFactory = jasmine
          .createSpy('spied factory')
          .and.callFake(combineReducers);
        reducer = createReducerFactory(spiedFactory, metaReducers)(
          reducerMap,
          initialState
        );
      });
      it(`should pass the reducers and initialState to the factory method`, () => {
        expect(spiedFactory).toHaveBeenCalledWith(reducerMap, initialState);
      });
      it(`should return the expected initialState`, () => {
        expect(reducer(undefined, { type: 'init' })).toEqual(expectedState);
      });
    };

    describe(`without meta reducers`, () => {
      const metaReducers: any[] = [];
      describe(
        `with initial state`,
        runWithExpectations(metaReducers, initialState, initialState)
      );
      describe(
        `without initial state`,
        runWithExpectations(metaReducers, undefined, { fruit: 'banana' })
      );
    });

    describe(`with meta reducers`, () => {
      const noopMetaReducer = (r: any) => r;
      const metaReducers: any[] = [noopMetaReducer];
      describe(
        `with initial state`,
        runWithExpectations(metaReducers, initialState, initialState)
      );
      describe(
        `without initial state`,
        runWithExpectations(metaReducers, undefined, { fruit: 'banana' })
      );
    });
  });
});
