import { EMPTY, noop, Observable, of, throwError } from 'rxjs';
import { tapResponse } from '@ngrx/component-store';
import { concatMap, finalize } from 'rxjs/operators';

describe('tapResponse', () => {
  it('should invoke next callback on next', () => {
    const nextCallback = jest.fn<void, [number]>();

    of(1, 2, 3).pipe(tapResponse(nextCallback, noop)).subscribe();

    expect(nextCallback.mock.calls).toEqual([[1], [2], [3]]);
  });

  it('should invoke error callback on error', () => {
    const errorCallback = jest.fn<void, [{ message: string }]>();
    const error = { message: 'error' };

    throwError(() => error)
      .pipe(tapResponse(noop, errorCallback))
      .subscribe();

    expect(errorCallback).toHaveBeenCalledWith(error);
  });

  it('should invoke complete callback on complete', () => {
    const completeCallback = jest.fn<void, []>();

    EMPTY.pipe(tapResponse(noop, noop, completeCallback)).subscribe();

    expect(completeCallback).toHaveBeenCalledWith();
  });

  it('should not unsubscribe from outer observable on inner observable error', () => {
    const innerCompleteCallback = jest.fn<void, []>();
    const outerCompleteCallback = jest.fn<void, []>();

    new Observable((subscriber) => subscriber.next(1))
      .pipe(
        concatMap(() =>
          throwError(() => 'error').pipe(
            tapResponse(noop, noop),
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
