import { noop, Observable, of, throwError } from 'rxjs';
import { mapResponse } from '..';
import { concatMap, finalize } from 'rxjs/operators';
import { vi } from 'vitest';

describe('mapResponse', () => {
  it('should map the emitted value using the next callback', () => {
    const results: number[] = [];

    of(1, 2, 3)
      .pipe(
        mapResponse({
          next: (value) => value + 1,
          error: noop,
        })
      )
      .subscribe((result) => {
        results.push(result as number);
      });

    expect(results).toEqual([2, 3, 4]);
  });

  it('should map the thrown error using the error callback', () =>
    new Promise((done) => {
      throwError(() => 'error')
        .pipe(
          mapResponse({
            next: noop,
            error: (error) => `mapped ${error}`,
          })
        )
        .subscribe((result) => {
          expect(result).toBe('mapped error');
          done(void 0);
        });
    }));

  it('should map the error thrown in next callback using error callback', () =>
    new Promise((done) => {
      function producesError() {
        throw 'error';
      }

      of(1)
        .pipe(
          mapResponse({
            next: producesError,
            error: (error) => `mapped ${error}`,
          })
        )
        .subscribe((result) => {
          expect(result).toBe('mapped error');
          done(void 0);
        });
    }));

  it('should not unsubscribe from outer observable on inner observable error', () => {
    const innerCompleteCallback = vi.fn<() => void>();
    const outerCompleteCallback = vi.fn<() => void>();

    new Observable((subscriber) => subscriber.next(1))
      .pipe(
        concatMap(() =>
          throwError(() => 'error').pipe(
            mapResponse({
              next: noop,
              error: noop,
            }),
            finalize(innerCompleteCallback)
          )
        ),
        finalize(outerCompleteCallback)
      )
      .subscribe();

    expect(innerCompleteCallback).toHaveBeenCalled();
    expect(outerCompleteCallback).not.toHaveBeenCalled();
  });
});
