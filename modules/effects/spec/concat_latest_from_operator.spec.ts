import { of } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import { hot } from 'jasmine-marbles';
import { concatLatestFrom } from '../src/concat_latest_from_operator';

describe('concatLatestFrom', () => {
  describe('no triggering value appears in source', () => {
    it('should not evaluate the array', () => {
      let evaluated = false;
      const toBeLazilyEvaluated = () => {
        evaluated = true;
        return of(4);
      };

      const numbers$ = hot('-a-b-', { a: 1, b: 2 }).pipe(
        skipWhile((num) => num < 3),
        concatLatestFrom(() => [toBeLazilyEvaluated()])
      );

      expect(numbers$).toBeObservable(hot('----'));
      expect(evaluated).toBe(false);
    });
    it('should not evaluate the observable', () => {
      let evaluated = false;
      const toBeLazilyEvaluated = () => {
        evaluated = true;
        return of(4);
      };

      const numbers$ = hot('-a-b-', { a: 1, b: 2 }).pipe(
        skipWhile((num) => num < 3),
        concatLatestFrom(() => toBeLazilyEvaluated())
      );

      expect(numbers$).toBeObservable(hot('----'));
      expect(evaluated).toBe(false);
    });
  });
  describe('a triggering value appears in source', () => {
    it('should evaluate the array of observables', () => {
      let evaluated = false;
      const toBeLazilyEvaluated = () => {
        evaluated = true;
        return of(4);
      };

      const numbers$ = hot('-a-b-c-', { a: 1, b: 2, c: 3 }).pipe(
        skipWhile((num) => num < 3),
        concatLatestFrom(() => [toBeLazilyEvaluated()])
      );

      expect(numbers$).toBeObservable(hot('-----d', { d: [3, 4] }));
      expect(evaluated).toBe(true);
    });
    it('should evaluate the observable', () => {
      let evaluated = false;
      const toBeLazilyEvaluated = () => {
        evaluated = true;
        return of(4);
      };

      const numbers$ = hot('-a-b-c-', { a: 1, b: 2, c: 3 }).pipe(
        skipWhile((num) => num < 3),
        concatLatestFrom(() => toBeLazilyEvaluated())
      );

      expect(numbers$).toBeObservable(hot('-----d', { d: [3, 4] }));
      expect(evaluated).toBe(true);
    });
  });
});
