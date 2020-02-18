import { toObservableValue } from '../../../src/core/operators/toObservableValue';
import { ArgumentNotObservableError } from '../../../src/core/utils';
import { EMPTY, isObservable, Observable, of } from 'rxjs';

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

    it('should take a undefined', () => {
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
          expect(e).toBe(ArgumentNotObservableError);
        },
      });
    });
  });

  describe('used as RxJS operator function', () => {
    it('should take observables', () => {
      const observable: Observable<Observable<never>> = of(EMPTY);
      const complete: jasmine.Spy = jasmine.createSpy('complete');
      observable.pipe(toObservableValue).subscribe({
        complete: complete,
      });
      expect(complete).toHaveBeenCalled();
    });

    it('should take a promise', () => {
      const observable: Observable<Promise<any>> = of(Promise.resolve());
      const complete: jasmine.Spy = jasmine.createSpy('complete');
      observable.pipe(toObservableValue).subscribe({
        complete: complete,
      });
      expect(complete).toHaveBeenCalled();
    });

    it('should take a undefined', () => {
      const observable: Observable<any> = of(undefined);
      observable.pipe(toObservableValue).subscribe(val => {
        expect(val).toBe(undefined);
      });
    });

    it('should take a null', () => {
      const observable: Observable<any> = of(null);
      observable.pipe(toObservableValue).subscribe(val => {
        expect(val).toBe(null);
      });
    });

    it('throw if no observable, promise, undefined or null is passed', () => {
      const observable: Observable<string> = of('invalid');
      observable.pipe(toObservableValue).subscribe({
        error(e) {
          expect(e).toBe(ArgumentNotObservableError);
        },
      });
    });
  });
});
