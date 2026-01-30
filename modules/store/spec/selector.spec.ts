import * as ngCore from '@angular/core';
import { cold } from 'jasmine-marbles';
import {
  createSelector,
  createFeatureSelector,
  defaultMemoize,
  createSelectorFactory,
  resultMemoize,
  MemoizedProjection,
} from '..';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { setNgrxMockEnvironment } from '../src';

import { type Mock, vi } from 'vitest';

vi.mock('@angular/core', { spy: true });

describe('Selectors', () => {
  let countOne: number;
  let countTwo: number;
  let countThree: number;

  let incrementOne: Mock;
  let incrementTwo: Mock;
  let incrementThree: Mock;

  beforeEach(() => {
    countOne = 0;
    countTwo = 0;
    countThree = 0;

    incrementOne = vi.fn(() => {
      return ++countOne;
    });

    incrementTwo = vi.fn(() => {
      return ++countTwo;
    });

    incrementThree = vi.fn(() => {
      return ++countThree;
    });
  });

  describe('createSelector', () => {
    it('should deliver the value of selectors to the projection function', () => {
      const projectFn = vi.fn();

      const selector = createSelector(
        incrementOne,
        incrementTwo,
        projectFn
      )({});

      expect(projectFn).toHaveBeenCalledWith(countOne, countTwo);
    });

    it('should allow an override of the selector return', () => {
      const projectFn = vi.fn().mockReturnValue(2);

      const selector = createSelector(incrementOne, incrementTwo, projectFn);

      expect((selector.projector as any)()).toBe(2);

      selector.setResult(5);

      const result2 = selector({});

      expect(result2).toBe(5);
    });

    it('should be possible to test a projector fn independent from the selectors it is composed of', () => {
      const projectFn = vi.fn();
      const selector = createSelector(incrementOne, incrementTwo, projectFn);

      selector.projector('', '');

      expect(incrementOne).not.toHaveBeenCalled();
      expect(incrementTwo).not.toHaveBeenCalled();
      expect(projectFn).toHaveBeenCalledWith('', '');
    });

    it('should call the projector function only when the value of a dependent selector change', () => {
      const firstState = { first: 'state', unchanged: 'state' };
      const secondState = { second: 'state', unchanged: 'state' };
      const neverChangingSelector = vi.fn((state: any) => {
        return state.unchanged;
      });
      const projectFn = vi.fn();
      const selector = createSelector(neverChangingSelector, projectFn);

      selector(firstState);
      selector(secondState);

      expect(projectFn).toHaveBeenCalledTimes(1);
    });

    it('should memoize the function', () => {
      const firstState = { first: 'state' };
      const secondState = { second: 'state' };
      const projectFn = vi.fn();
      const selector = createSelector(
        incrementOne,
        incrementTwo,
        incrementThree,
        projectFn
      );

      selector(firstState);
      selector(firstState);
      selector(firstState);
      selector(secondState);
      selector(secondState);

      expect(incrementOne).toHaveBeenCalledTimes(2);
      expect(incrementTwo).toHaveBeenCalledTimes(2);
      expect(incrementThree).toHaveBeenCalledTimes(2);
      expect(projectFn).toHaveBeenCalledTimes(2);
    });

    it('should not memoize last successful projection result in case of error', () => {
      const firstState = { ok: true };
      const secondState = { ok: false };
      const fail = () => {
        throw new Error();
      };
      const projectorFn = vi.fn((s: any) => (s.ok ? s.ok : fail()));
      const selectorFn = vi.fn(
        createSelector((state: any) => state, projectorFn)
      );

      selectorFn(firstState);

      expect(() => selectorFn(secondState)).toThrow(new Error());
      expect(() => selectorFn(secondState)).toThrow(new Error());

      selectorFn(firstState);
      expect(selectorFn).toHaveBeenCalledTimes(4);
      expect(projectorFn).toHaveBeenCalledTimes(3);
    });

    it('should allow you to release memoized arguments', () => {
      const state = { first: 'state' };
      const projectFn = vi.fn();
      const selector = createSelector(incrementOne, projectFn);

      selector(state);
      selector(state);
      selector.release();
      selector(state);
      selector(state);

      expect(projectFn).toHaveBeenCalledTimes(2);
    });

    it('should recursively release ancestor selectors', () => {
      const grandparent = createSelector(incrementOne, (a) => a);
      const parent = createSelector(grandparent, (a) => a);
      const child = createSelector(parent, (a) => a);

      vi.spyOn(grandparent, 'release');
      vi.spyOn(parent, 'release');

      child.release();

      expect(grandparent.release).toHaveBeenCalled();
      expect(parent.release).toHaveBeenCalled();
    });

    it('should create a selector from selectors dictionary', () => {
      interface State {
        x: number;
        y: string;
      }

      const selectX = (state: State) => state.x + 1;
      const selectY = (state: State) => state.y;

      const selectDictionary = createSelector({
        s: selectX,
        m: selectY,
      });

      expect(selectDictionary({ x: 1, y: 'ngrx' })).toEqual({
        s: 2,
        m: 'ngrx',
      });
      expect(selectDictionary({ x: 2, y: 'ngrx' })).toEqual({
        s: 3,
        m: 'ngrx',
      });
    });

    it('should create a selector from empty dictionary', () => {
      const selectDictionary = createSelector({});

      expect(selectDictionary({ x: 1, y: 'ngrx' })).toEqual({});
      expect(selectDictionary({ x: 2, y: 'store' })).toEqual({});
    });
  });

  describe('createSelector with arrays', () => {
    it('should deliver the value of selectors to the projection function', () => {
      const projectFn = vi.fn();
      const selector = createSelector(
        [incrementOne, incrementTwo],
        projectFn
      )({});

      expect(projectFn).toHaveBeenCalledWith(countOne, countTwo);
    });

    it('should be possible to test a projector fn independent from the selectors it is composed of', () => {
      const projectFn = vi.fn();
      const selector = createSelector([incrementOne, incrementTwo], projectFn);

      selector.projector('', '');

      expect(incrementOne).not.toHaveBeenCalled();
      expect(incrementTwo).not.toHaveBeenCalled();
      expect(projectFn).toHaveBeenCalledWith('', '');
    });

    it('should call the projector function only when the value of a dependent selector change', () => {
      const firstState = { first: 'state', unchanged: 'state' };
      const secondState = { second: 'state', unchanged: 'state' };
      const neverChangingSelector = vi.fn((state: any) => {
        return state.unchanged;
      });
      const projectFn = vi.fn();
      const selector = createSelector([neverChangingSelector], projectFn);

      selector(firstState);
      selector(secondState);

      expect(projectFn).toHaveBeenCalledTimes(1);
    });

    it('should memoize the function', () => {
      const firstState = { first: 'state' };
      const secondState = { second: 'state' };
      const projectFn = vi.fn();
      const selector = createSelector(
        [incrementOne, incrementTwo, incrementThree],
        projectFn
      );

      selector(firstState);
      selector(firstState);
      selector(firstState);
      selector(secondState);
      selector(secondState);

      expect(incrementOne).toHaveBeenCalledTimes(2);
      expect(incrementTwo).toHaveBeenCalledTimes(2);
      expect(incrementThree).toHaveBeenCalledTimes(2);
      expect(projectFn).toHaveBeenCalledTimes(2);
    });

    it('should allow you to release memoized arguments', () => {
      const state = { first: 'state' };
      const projectFn = vi.fn();
      const selector = createSelector([incrementOne], projectFn);

      selector(state);
      selector(state);
      selector.release();
      selector(state);
      selector(state);

      expect(projectFn).toHaveBeenCalledTimes(2);
    });

    it('should recursively release ancestor selectors', () => {
      const grandparent = createSelector([incrementOne], (a) => a);
      const parent = createSelector([grandparent], (a) => a);
      const child = createSelector([parent], (a) => a);

      vi.spyOn(grandparent, 'release');
      vi.spyOn(parent, 'release');

      child.release();

      expect(grandparent.release).toHaveBeenCalled();
      expect(parent.release).toHaveBeenCalled();
    });
  });

  describe('createFeatureSelector', () => {
    const featureName = 'featureA';
    let featureSelector: (state: any) => number;
    let warnSpy: Mock;

    beforeEach(() => {
      featureSelector = createFeatureSelector<number>(featureName);
      warnSpy = vi.spyOn(console, 'warn');
    });

    afterEach(() => warnSpy.mockReset());

    it('should memoize the result', () => {
      const firstValue = { first: 'value' };
      const firstState = { [featureName]: firstValue };
      const secondValue = { secondValue: 'value' };
      const secondState = { [featureName]: secondValue };

      const state$ = cold('--a--a--a--b--', { a: firstState, b: secondState });
      const expected$ = cold('--a--------b--', {
        a: firstValue,
        b: secondValue,
      });
      const featureState$ = state$.pipe(
        map(featureSelector),
        distinctUntilChanged()
      );

      expect(featureState$).toBeObservable(expected$);
    });

    describe('Warning', () => {
      describe('should not log when: ', () => {
        it('the feature does exist', () => {
          const ngSpy = vi.mocked(ngCore.isDevMode).mockReturnValue(true);
          const selector = createFeatureSelector('featureA');

          selector({ featureA: {} });

          expect(warnSpy).not.toHaveBeenCalled();

          ngSpy.mockReset();
          ngSpy.mockReturnValue(true);
        });

        it('the feature key exist but is falsy', () => {
          const ngSpy = vi.mocked(ngCore.isDevMode).mockReturnValue(true);
          const selector = createFeatureSelector('featureB');

          selector({ featureA: {}, featureB: undefined });

          expect(warnSpy).not.toHaveBeenCalled();

          ngSpy.mockReset();
          ngSpy.mockReturnValue(true);
        });

        it('not in development mode', () => {
          const ngSpy = vi.mocked(ngCore.isDevMode).mockReturnValue(false);
          const selector = createFeatureSelector('featureB');

          selector({ featureA: {} });

          expect(warnSpy).not.toHaveBeenCalled();

          ngSpy.mockReset();
          ngSpy.mockReturnValue(true);
        });
      });

      describe('warning will ', () => {
        it('be logged when not in mock environment', () => {
          const ngSpy = vi.mocked(ngCore.isDevMode).mockReturnValue(true);
          const selector = createFeatureSelector('featureB');

          selector({ featureA: {} });

          expect(warnSpy).toHaveBeenCalled();
          expect(warnSpy.mock.lastCall?.[0]).toMatch(
            /The feature name "featureB" does not exist/
          );

          ngSpy.mockReset();
        });

        it('not be logged when in mock environment', () => {
          setNgrxMockEnvironment(true);
          const selector = createFeatureSelector('featureB');

          selector({ featureA: {} });

          expect(warnSpy).not.toHaveBeenCalled();
          setNgrxMockEnvironment(false);
        });
      });
    });
  });

  describe('createSelectorFactory', () => {
    it('should return a selector creator function', () => {
      const projectFn = vi.fn();
      const selectorFunc = createSelectorFactory(defaultMemoize);

      const selector = selectorFunc(incrementOne, incrementTwo, projectFn)({});

      expect(projectFn).toHaveBeenCalledWith(countOne, countTwo);
    });

    it('should allow a custom memoization function', () => {
      const projectFn = vi.fn();
      const anyFn = vi.fn(() => true);
      const equalFn = vi.fn(() => true);
      const customMemoizer = (aFn: any = anyFn, eFn: any = equalFn) =>
        defaultMemoize(anyFn, equalFn);
      const customSelector = createSelectorFactory(customMemoizer);

      const selector = customSelector(incrementOne, incrementTwo, projectFn);
      selector(1);
      selector(2);

      expect(anyFn.mock.calls.length).toEqual(1);
    });

    it('should allow a custom state memoization function', () => {
      const projectFn = vi.fn();
      const stateFn = vi.fn();
      const selectorFunc = createSelectorFactory(defaultMemoize, { stateFn });

      const selector = selectorFunc(incrementOne, incrementTwo, projectFn)({});

      expect(stateFn).toHaveBeenCalled();
    });
  });

  describe('defaultMemoize', () => {
    it('should allow a custom equality function', () => {
      const anyFn = vi.fn(() => true);
      const equalFn = vi.fn(() => true);
      const memoizer = defaultMemoize(anyFn, equalFn);

      memoizer.memoized(1, 2, 3);
      memoizer.memoized(1, 2);

      expect(anyFn.mock.calls.length).toEqual(1);
    });
  });

  describe('resultMemoize', () => {
    let projectionFnSpy: Mock;
    const ARRAY = ['a', 'ab', 'b'];
    const ARRAY_CHANGED = [...ARRAY, 'bc'];
    const A_FILTER: { by: string } = { by: 'a' };
    const B_FILTER: { by: string } = { by: 'b' };

    let arrayMemoizer: MemoizedProjection;

    // Compare a and b on equality. If a and b are Arrays then compare them
    // on their content.
    function isResultEqual(a: any, b: any) {
      if (a instanceof Array) {
        return a.length === b.length && a.every((fromA) => b.includes(fromA));
      }
      // Default comparison
      return a === b;
    }

    beforeEach(() => {
      projectionFnSpy = vi.fn((arr: string[], filter: { by: string }) =>
        arr.filter((item) => item.startsWith(filter.by))
      );

      arrayMemoizer = resultMemoize(projectionFnSpy, isResultEqual);
    });

    it('should not rerun projector function when arguments stayed the same', () => {
      arrayMemoizer.memoized(ARRAY, A_FILTER);
      arrayMemoizer.memoized(ARRAY, A_FILTER);

      expect(projectionFnSpy.mock.calls.length).toBe(1);
    });

    it('should rerun projector function when arguments changed', () => {
      arrayMemoizer.memoized(ARRAY, A_FILTER);
      arrayMemoizer.memoized(ARRAY_CHANGED, A_FILTER);

      expect(projectionFnSpy.mock.calls.length).toBe(2);
    });

    it('should return the same instance of results when projector function produces the same results array', () => {
      const result1 = arrayMemoizer.memoized(ARRAY, A_FILTER);
      const result2 = arrayMemoizer.memoized(ARRAY, A_FILTER);

      expect(result1).toBe(result2);
    });

    it('should return the same instance of results when projector function produces similar results array', () => {
      const result1 = arrayMemoizer.memoized(ARRAY, A_FILTER);
      const result2 = arrayMemoizer.memoized(ARRAY_CHANGED, A_FILTER);

      expect(result1).toBe(result2);
    });

    it('should return the new instance of results when projector function produces different result', () => {
      const result1 = arrayMemoizer.memoized(ARRAY, A_FILTER);
      const result2 = arrayMemoizer.memoized(ARRAY_CHANGED, B_FILTER);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1).not.toBe(result2);
      expect(result1).not.toEqual(result2);
    });
  });
});
