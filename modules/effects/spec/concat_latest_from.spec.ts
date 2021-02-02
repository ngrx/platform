import { Observable, of } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import { hot } from 'jasmine-marbles';
import { concatLatestFrom } from '../src/concat_latest_from';

describe('concatLatestFrom', () => {
  describe('no triggering value appears in source', () => {
    it('should not evaluate the array', () => {
      let evaluated = false;
      const toBeLazilyEvaluated = () => {
        evaluated = true;
        return of(4);
      };
      const input$: Observable<number> = hot('-a-b-', { a: 1, b: 2 });
      const numbers$: Observable<[number, number]> = input$.pipe(
        skipWhile((value) => value < 3),
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
      const input$: Observable<number> = hot('-a-b-', { a: 1, b: 2 });
      const numbers$: Observable<[number, number]> = input$.pipe(
        skipWhile((value) => value < 3),
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
      const input$: Observable<number> = hot('-a-b-c-', { a: 1, b: 2, c: 3 });
      const numbers$: Observable<[number, number]> = input$.pipe(
        skipWhile((value) => value < 3),
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
      const input$: Observable<number> = hot('-a-b-c-', { a: 1, b: 2, c: 3 });
      const numbers$: Observable<[number, number]> = input$.pipe(
        skipWhile((value) => value < 3),
        concatLatestFrom(() => toBeLazilyEvaluated())
      );
      expect(numbers$).toBeObservable(hot('-----d', { d: [3, 4] }));
      expect(evaluated).toBe(true);
    });
  });
  describe('multiple triggering values appear in source', () => {
    it('evaluates the array of observables', () => {
      const input$: Observable<number> = hot('-a-b-c-', { a: 1, b: 2, c: 3 });
      const numbers$: Observable<[number, string]> = input$.pipe(
        concatLatestFrom(() => [of('eval')])
      );
      expect(numbers$).toBeObservable(
        hot('-a-b-c', { a: [1, 'eval'], b: [2, 'eval'], c: [3, 'eval'] })
      );
    });
    it('uses incoming value', () => {
      const input$: Observable<number> = hot('-a-b-c-', { a: 1, b: 2, c: 3 });
      const numbers$: Observable<[number, string]> = input$.pipe(
        concatLatestFrom((num) => [of(num + ' eval')])
      );
      expect(numbers$).toBeObservable(
        hot('-a-b-c', { a: [1, '1 eval'], b: [2, '2 eval'], c: [3, '3 eval'] })
      );
    });
  });
  describe('evaluates multiple observables', () => {
    it('gets values from both observable in specific order', () => {
      const input$: Observable<number> = hot('-a-b-c-', { a: 1, b: 2, c: 3 });
      const numbers$: Observable<[number, string, string]> = input$.pipe(
        skipWhile((value) => value < 3),
        concatLatestFrom(() => [of('one'), of('two')])
      );
      expect(numbers$).toBeObservable(hot('-----d', { d: [3, 'one', 'two'] }));
    });
    it('can use the value passed through source observable', () => {
      const input$: Observable<number> = hot('-a-b-c-d', {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      });
      const numbers$: Observable<[number, string, string]> = input$.pipe(
        skipWhile((value) => value < 3),
        concatLatestFrom((num) => [of(num + ' one'), of(num + ' two')])
      );
      expect(numbers$).toBeObservable(
        hot('-----c-d', { c: [3, '3 one', '3 two'], d: [4, '4 one', '4 two'] })
      );
    });
  });
});
