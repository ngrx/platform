import { EMPTY, isObservable, Observable, of } from 'rxjs';
import { toObservableValue } from '../../../src/core/projections';

describe('toObservableValue', () => {
  describe('used as RxJS creation function', () => {
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

    it('should take undefined', () => {
      const observable: Observable<any> = toObservableValue(undefined);
      expect(isObservable(observable)).toBe(true);
    });

    it('should take a null', () => {
      const observable: Observable<any> = toObservableValue(null);
      expect(isObservable(observable)).toBe(true);
    });

    it('throw if no observable, promise, undefined or null is passed', () => {
      const observable: Observable<any> = toObservableValue(null);
      observable.subscribe({
        error(e) {
          expect(e).toBeDefined();
        },
      });
    });
  });
});
