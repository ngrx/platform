import { ErrorHandler, Provider, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { createEffect, EFFECTS_ERROR_HANDLER, EffectsModule } from '..';
import * as effectsSrc from '../src/effects_error_handler';

describe('Effects Error Handler', () => {
  let subscriptionCount: number;
  let globalErrorHandler: jasmine.Spy;
  let storeNext: jasmine.Spy;

  function makeEffectTestBed(effect: Type<any>, ...providers: Provider[]) {
    subscriptionCount = 0;

    TestBed.configureTestingModule({
      imports: [EffectsModule.forRoot([effect])],
      providers: [
        {
          provide: Store,
          useValue: {
            next: jasmine.createSpy('storeNext'),
            dispatch: jasmine.createSpy('dispatch'),
          },
        },
        {
          provide: ErrorHandler,
          useValue: {
            handleError: jasmine.createSpy('globalErrorHandler'),
          },
        },
        ...providers,
      ],
    });

    globalErrorHandler = TestBed.inject(ErrorHandler)
      .handleError as jasmine.Spy;
    const store = TestBed.inject(Store);
    storeNext = store.next as jasmine.Spy;
  }

  it('should retry on infinite error up to 10 times', () => {
    makeEffectTestBed(AlwaysErrorEffect);

    expect(globalErrorHandler.calls.count()).toBe(10);
  });

  it('should retry and notify error handler when effect error handler is not provided', () => {
    makeEffectTestBed(ErrorEffect);

    // two subscriptions expected:
    // 1. Initial subscription to the effect (this will error)
    // 2. Resubscription to the effect after error (this will not error)
    expect(subscriptionCount).toBe(2);
    expect(globalErrorHandler).toHaveBeenCalledWith(new Error('effectError'));
  });

  it('should use custom error behavior when EFFECTS_ERROR_HANDLER is provided', () => {
    const effectsErrorHandlerSpy = jasmine
      .createSpy()
      .and.callFake((effect$: Observable<any>, errorHandler: ErrorHandler) => {
        return effect$.pipe(
          catchError((err) => {
            errorHandler.handleError(
              new Error('inside custom handler: ' + err.message)
            );
            return of({ type: 'custom action' });
          })
        );
      });

    makeEffectTestBed(ErrorEffect, {
      provide: EFFECTS_ERROR_HANDLER,
      useValue: effectsErrorHandlerSpy,
    });

    expect(effectsErrorHandlerSpy).toHaveBeenCalledWith(
      jasmine.any(Observable),
      TestBed.inject(ErrorHandler)
    );
    expect(globalErrorHandler).toHaveBeenCalledWith(
      new Error('inside custom handler: effectError')
    );
    expect(subscriptionCount).toBe(1);
    expect(storeNext).toHaveBeenCalledWith({ type: 'custom action' });
  });

  class ErrorEffect {
    effect$ = createEffect(errorFirstSubscriber, {
      useEffectsErrorHandler: true,
    });
  }

  class AlwaysErrorEffect {
    effect$ = createEffect(() => throwError(() => 'always an error') as any);
  }

  /**
   * This observable factory returns an observable that will never emit, but the first subscriber will get an immediate
   * error. All subsequent subscribers will just get an observable that does not emit.
   */
  function errorFirstSubscriber(): Observable<Action> {
    return new Observable((observer) => {
      subscriptionCount++;

      if (subscriptionCount === 1) {
        observer.error(new Error('effectError'));
      }
    });
  }
});
