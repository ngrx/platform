/**
 * @fileOverview
 * @author Brian Frichette (brian@eturi.com)
 */

import { omit } from '../src/utils';
import { combineReducers, compose } from '@ngrx/store';

describe(`Store utils`, () => {
  describe(`combineReducers()`, () => {
    const s1 = { x: '' };
    const s2 = { y: '' };
    const r1 = (s = s1, a: any): typeof s1 =>
      a.type === 's1' ? { ...s, x: a.payload } : s;
    const r2 = (s = s2, a: any): typeof s2 =>
      a.type === 's2' ? { ...s, y: a.payload } : s;
    const reducers = { r1, r2, extraneous: true };
    const initialState = { r1: { x: 'foo' }, r2: { y: 'bar' } };

    let combination: any;

    beforeEach(() => {
      combination = combineReducers(reducers, initialState);
    });

    it(`should ignore extraneous keys`, () => {
      expect(combination(undefined, { type: '' }).extraneous).toBeUndefined();
    });

    it(`should create a function that accepts state and action and returns combined state object`, () => {
      const updateAction1 = { type: 's1', payload: 'baz' };
      expect(combination(initialState, updateAction1)).toEqual({
        ...initialState,
        r1: { x: updateAction1.payload },
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
});
