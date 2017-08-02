import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { cold } from 'jasmine-marbles';
import { createSelector, createFeatureSelector } from '../';

describe('Selectors', () => {
  let countOne: number;
  let countTwo: number;
  let countThree: number;

  let incrementOne: jasmine.Spy;
  let incrementTwo: jasmine.Spy;
  let incrementThree: jasmine.Spy;

  beforeEach(() => {
    countOne = 0;
    countTwo = 0;
    countThree = 0;

    incrementOne = jasmine.createSpy('incrementOne').and.callFake(() => {
      return ++countOne;
    });

    incrementTwo = jasmine.createSpy('incrementTwo').and.callFake(() => {
      return ++countTwo;
    });

    incrementThree = jasmine.createSpy('incrementThree').and.callFake(() => {
      return ++countThree;
    });
  });

  describe('createSelector', () => {
    it('should deliver the value of selectors to the projection function', () => {
      const projectFn = jasmine.createSpy('projectionFn');

      const selector = createSelector(incrementOne, incrementTwo, projectFn)(
        {}
      );

      expect(projectFn).toHaveBeenCalledWith(countOne, countTwo);
    });

    it('should call the projector function only when the value of a dependent selector change', () => {
      const firstState = { first: 'state', unchanged: 'state' };
      const secondState = { second: 'state', unchanged: 'state' };
      const neverChangingSelector = jasmine
        .createSpy('unchangedSelector')
        .and.callFake((state: any) => {
          return state.unchanged;
        });
      const projectFn = jasmine.createSpy('projectionFn');
      const selector = createSelector(neverChangingSelector, projectFn);

      selector(firstState);
      selector(secondState);

      expect(projectFn).toHaveBeenCalledTimes(1);
    });

    it('should memoize the function', () => {
      const firstState = { first: 'state' };
      const secondState = { second: 'state' };
      const projectFn = jasmine.createSpy('projectionFn');
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

      expect(incrementOne).toHaveBeenCalledTimes(2);
      expect(incrementTwo).toHaveBeenCalledTimes(2);
      expect(incrementThree).toHaveBeenCalledTimes(2);
      expect(projectFn).toHaveBeenCalledTimes(2);
    });

    it('should allow you to release memoized arguments', () => {
      const state = { first: 'state' };
      const projectFn = jasmine.createSpy('projectionFn');
      const selector = createSelector(incrementOne, projectFn);

      selector(state);
      selector(state);
      selector.release();
      selector(state);
      selector(state);

      expect(projectFn).toHaveBeenCalledTimes(2);
    });

    it('should recursively release ancestor selectors', () => {
      const grandparent = createSelector(incrementOne, a => a);
      const parent = createSelector(grandparent, a => a);
      const child = createSelector(parent, a => a);
      spyOn(grandparent, 'release').and.callThrough();
      spyOn(parent, 'release').and.callThrough();

      child.release();

      expect(grandparent.release).toHaveBeenCalled();
      expect(parent.release).toHaveBeenCalled();
    });
  });

  describe('createFeatureSelector', () => {
    let featureName = '@ngrx/router-store';
    let featureSelector: (state: any) => number;

    beforeEach(() => {
      featureSelector = createFeatureSelector<number>(featureName);
    });

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
      const featureState$ = state$.map(featureSelector).distinctUntilChanged();

      expect(featureState$).toBeObservable(expected$);
    });
  });
});
