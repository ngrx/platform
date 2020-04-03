import { EMPTY, isObservable, Observable } from 'rxjs';
import { toObservableValue } from '../../../src/core/projections';

describe('toObservableValue', () => {
  describe('used as RxJS creation function', () => {
    // NOTE: (benlesh) These tests are probably all redundant, as you're just
    // testing `rxjs` from in every case but `null` and `undefined`.

    it('should take observables', () => {
      const observable: Observable<any> = toObservableValue(EMPTY);
      expect(isObservable(observable)).toBe(true);
    });

    it('should take a promise', () => {
      const observable: Observable<any> = toObservableValue(
        new Promise(() => {})
      );
      expect(isObservable(observable)).toBe(true);
    });

    it('should take an iterable', () => {
      const set = new Set([1, 2, 3]);
      const observable: Observable<any> = toObservableValue(set.values());
      expect(isObservable(observable)).toBe(true);
    });

    it('should take undefined', () => {
      const observable: Observable<any> = toObservableValue(undefined);
      expect(isObservable(observable)).toBe(true);
    });

    it('should take a null', () => {
      const observable: Observable<any> = toObservableValue(null);
      expect(isObservable(observable)).toBe(true);
    });

    // NOTE: (benlesh) - AFIACT this test would never have passed with the existing code
    // `toObservableValue(null)` was made to return `of(null)`
    xit('throw if no observable, promise, undefined or null is passed', () => {
      const observable: Observable<any> = toObservableValue(null);
      observable.subscribe({
        error(e) {
          expect(e).toBeDefined();
        },
      });
    });
  });
});
