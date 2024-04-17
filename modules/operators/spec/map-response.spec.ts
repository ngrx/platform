import { noop, Observable, of, throwError } from 'rxjs';
import { mapResponse } from '..';
import { concatMap, finalize } from 'rxjs/operators';

describe('mapResponse', () => {
  it('should invoke next callback on next', () => {
    const nextCallback = jest.fn<void, [number]>();

    of(1, 2, 3)
      .pipe(
        mapResponse({
          next: nextCallback,
          error: noop,
        })
      )
      .subscribe();

    expect(nextCallback.mock.calls).toEqual([[1], [2], [3]]);
  });

  it('should invoke error callback on error', () => {
    const errorCallback = jest.fn<void, [{ message: string }]>();
    const error = { message: 'error' };

    throwError(() => error)
      .pipe(
        mapResponse({
          next: noop,
          error: errorCallback,
        })
      )
      .subscribe();

    expect(errorCallback).toHaveBeenCalledWith(error);
  });

  it('should invoke error callback on the exception thrown in next', () => {
    const errorCallback = jest.fn<void, [{ message: string }]>();
    const error = { message: 'error' };

    function producesError() {
      throw error;
    }

    of(1)
      .pipe(
        mapResponse({
          next: producesError,
          error: errorCallback,
        })
      )
      .subscribe();

    expect(errorCallback).toHaveBeenCalledWith(error);
  });

  it('should not unsubscribe from outer observable on inner observable error', () => {
    const innerCompleteCallback = jest.fn<void, []>();
    const outerCompleteCallback = jest.fn<void, []>();

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
