import { fakeAsync, tick } from '@angular/core/testing';
import {
  BehaviorSubject,
  delay,
  EMPTY,
  NEVER,
  Observable,
  of,
  switchMap,
  throwError,
  timer,
} from 'rxjs';
import { createRenderEventManager } from '../../../src/core/render-event/manager';

describe('createRenderEventManager', () => {
  function setup<T>() {
    const resetHandler = jest.fn();
    const nextHandler = jest.fn();
    const errorHandler = jest.fn();
    const completeHandler = jest.fn();
    const renderEventManager = createRenderEventManager<T>({
      reset: resetHandler,
      next: nextHandler,
      error: errorHandler,
      complete: completeHandler,
    });
    renderEventManager.handlePotentialObservableChanges().subscribe();

    return {
      renderEventManager,
      resetHandler,
      nextHandler,
      errorHandler,
      completeHandler,
    };
  }

  describe('with first observable', () => {
    describe('that emits first event synchronously', () => {
      it('should call next handler with reset flag when first value is emitted', () => {
        const { renderEventManager, nextHandler } = setup<string>();

        renderEventManager.nextPotentialObservable(of('ngrx'));
        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 'ngrx',
          reset: true,
        });
      });

      it('should call next handler without reset flag when another value is emitted', () => {
        const { renderEventManager, nextHandler } = setup<string>();
        const subject = new BehaviorSubject('ngrx');

        renderEventManager.nextPotentialObservable(subject);
        subject.next('angular');

        expect(nextHandler.mock.calls[0][0]).toEqual({
          type: 'next',
          value: 'ngrx',
          reset: true,
        });
        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 'angular',
          reset: false,
        });
        expect(nextHandler).toHaveBeenCalledTimes(2);
      });

      it('should not call next handler second time when same value is emitted twice', fakeAsync(() => {
        const { renderEventManager, nextHandler } = setup<string>();
        const subject = new BehaviorSubject('angular');

        renderEventManager.nextPotentialObservable(subject);
        tick(10);
        subject.next('ngrx/component');
        tick(10);
        subject.next('ngrx/component');

        expect(nextHandler.mock.calls[0][0]).toEqual({
          type: 'next',
          value: 'angular',
          reset: true,
        });
        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 'ngrx/component',
          reset: false,
        });
        expect(nextHandler).toHaveBeenCalledTimes(2);
      }));

      it('should call error handler with reset flag when error is emitted', () => {
        const { renderEventManager, errorHandler } = setup<number>();

        renderEventManager.nextPotentialObservable(throwError(() => 'ERROR!'));
        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!',
          reset: true,
        });
      });

      it('should call error handler without reset flag when error is emitted as second event', () => {
        const { renderEventManager, errorHandler, nextHandler } =
          setup<number>();
        const subject = new BehaviorSubject(100);

        renderEventManager.nextPotentialObservable(subject);
        subject.error('ERROR!');

        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 100,
          reset: true,
        });
        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!',
          reset: false,
        });

        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledTimes(1);
      });

      it('should call complete handler with reset flag when complete is emitted', () => {
        const { renderEventManager, completeHandler } = setup<boolean>();

        renderEventManager.nextPotentialObservable(EMPTY);
        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: true,
        });
      });

      it('should call complete handler without reset flag when complete is emitted as second event', () => {
        const { renderEventManager, nextHandler, completeHandler } =
          setup<boolean>();
        const subject = new BehaviorSubject(true);

        renderEventManager.nextPotentialObservable(subject);
        subject.complete();

        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: true,
          reset: true,
        });
        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: false,
        });

        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(completeHandler).toHaveBeenCalledTimes(1);
      });
    });

    describe('that emits first event asynchronously', () => {
      it('should call reset handler immediately and next handler when value is emitted', fakeAsync(() => {
        const { renderEventManager, resetHandler, nextHandler } =
          setup<string>();

        renderEventManager.nextPotentialObservable(of('ngrx').pipe(delay(100)));

        expect(resetHandler).toHaveBeenCalledWith({
          type: 'reset',
          reset: true,
        });
        expect(nextHandler).not.toHaveBeenCalled();

        tick(100);

        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 'ngrx',
          reset: false,
        });
      }));

      it('should call reset handler immediately and error handler when error is emitted', fakeAsync(() => {
        const { renderEventManager, resetHandler, errorHandler } =
          setup<number>();

        renderEventManager.nextPotentialObservable(
          timer(100).pipe(switchMap(() => throwError(() => 'ERROR!')))
        );

        expect(resetHandler).toHaveBeenCalledWith({
          type: 'reset',
          reset: true,
        });
        expect(errorHandler).not.toHaveBeenCalled();

        tick(100);

        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!',
          reset: false,
        });
      }));

      it('should call complete handler immediately and error handler when error is emitted', fakeAsync(() => {
        const { renderEventManager, resetHandler, completeHandler } =
          setup<boolean>();

        renderEventManager.nextPotentialObservable(
          timer(100).pipe(switchMap(() => EMPTY))
        );

        expect(resetHandler).toHaveBeenCalledWith({
          type: 'reset',
          reset: true,
        });
        expect(completeHandler).not.toHaveBeenCalled();

        tick(100);

        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: false,
        });
      }));
    });

    describe('that never emits event', () => {
      it('should call reset handler', () => {
        const { renderEventManager, resetHandler } = setup();

        renderEventManager.nextPotentialObservable(NEVER);
        expect(resetHandler).toHaveBeenCalledWith({
          type: 'reset',
          reset: true,
        });
      });
    });
  });

  describe('with next observable', () => {
    function withNextObservableSetup<T>(firstObservable$: Observable<T>) {
      const { renderEventManager, ...rest } = setup<T>();
      renderEventManager.nextPotentialObservable(firstObservable$);

      return { renderEventManager, ...rest };
    }

    describe('that emits first event synchronously', () => {
      it('should call next handler with reset flag when first value is emitted', () => {
        const {
          renderEventManager,
          nextHandler,
          errorHandler,
          completeHandler,
        } = withNextObservableSetup<number>(throwError(() => 'ERROR!'));

        renderEventManager.nextPotentialObservable(of(100));

        // first observable
        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!',
          reset: true,
        });

        // next observable
        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 100,
          reset: true,
        });
        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: false,
        });

        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledTimes(1);
        expect(completeHandler).toHaveBeenCalledTimes(1);
      });

      it('should call next handler without reset flag when another value is emitted', () => {
        const { renderEventManager, nextHandler } = withNextObservableSetup(
          new BehaviorSubject(1)
        );
        const nextSubject = new BehaviorSubject(10);

        renderEventManager.nextPotentialObservable(nextSubject);
        nextSubject.next(100);

        // first observable
        expect(nextHandler.mock.calls[0][0]).toEqual({
          type: 'next',
          value: 1,
          reset: true,
        });

        // next observable
        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 10,
          reset: true,
        });
        expect(nextHandler.mock.calls[2][0]).toEqual({
          type: 'next',
          value: 100,
          reset: false,
        });

        expect(nextHandler).toHaveBeenCalledTimes(3);
      });

      it('should not call next handler second time when same value is emitted twice', () => {
        const { renderEventManager, nextHandler } = withNextObservableSetup(
          new BehaviorSubject(100)
        );
        const nextSubject = new BehaviorSubject(100);

        renderEventManager.nextPotentialObservable(nextSubject);
        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 100,
          reset: true,
        });
        expect(nextHandler).toHaveBeenCalledTimes(1);
      });

      it('should call error handler with reset flag when error is emitted', () => {
        const {
          renderEventManager,
          nextHandler,
          errorHandler,
          completeHandler,
        } = withNextObservableSetup(of(200));

        renderEventManager.nextPotentialObservable(throwError(() => 'ERROR!'));

        // first observable
        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 200,
          reset: true,
        });
        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: false,
        });

        // next observable
        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!',
          reset: true,
        });

        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledTimes(1);
        expect(completeHandler).toHaveBeenCalledTimes(1);
      });

      it('should not call error handler second time when same error is emitted twice', () => {
        const { renderEventManager, errorHandler } = withNextObservableSetup(
          throwError(() => 'SAME_ERROR!')
        );

        renderEventManager.nextPotentialObservable(
          throwError(() => 'SAME_ERROR!')
        );
        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'SAME_ERROR!',
          reset: true,
        });
        expect(errorHandler).toHaveBeenCalledTimes(1);
      });

      it('should call complete handler with reset flag when complete is emitted', () => {
        const { renderEventManager, nextHandler, completeHandler } =
          withNextObservableSetup(of(1));

        renderEventManager.nextPotentialObservable(EMPTY);

        // first observable
        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 1,
          reset: true,
        });
        expect(completeHandler.mock.calls[0][0]).toEqual({
          type: 'complete',
          reset: false,
        });

        // next observable
        expect(completeHandler.mock.calls[1][0]).toEqual({
          type: 'complete',
          reset: true,
        });

        expect(completeHandler).toHaveBeenCalledTimes(2);
      });

      it('should not call complete handler second time when complete is emitted twice ', () => {
        const { renderEventManager, completeHandler } = withNextObservableSetup(
          new Observable((subscriber) => subscriber.complete())
        );

        renderEventManager.nextPotentialObservable(NEVER);
        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: true,
        });
        expect(completeHandler).toHaveBeenCalledTimes(1);
      });
    });

    describe('that emits first event asynchronously', () => {
      it('should call reset handler immediately and next handler when value is emitted', fakeAsync(() => {
        const { renderEventManager, resetHandler, nextHandler } =
          withNextObservableSetup(of('ngrx'));

        renderEventManager.nextPotentialObservable(
          of('component').pipe(delay(100))
        );

        // first observable
        expect(nextHandler.mock.calls[0][0]).toEqual({
          type: 'next',
          value: 'ngrx',
          reset: true,
        });

        // next observable
        expect(resetHandler).toHaveBeenCalledWith({
          type: 'reset',
          reset: true,
        });
        expect(nextHandler.mock.calls[1]).not.toBeDefined();

        tick(100);

        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 'component',
          reset: false,
        });

        expect(resetHandler).toHaveBeenCalledTimes(1);
        expect(nextHandler).toHaveBeenCalledTimes(2);
      }));

      it('should call reset handler immediately and error handler when error is emitted', fakeAsync(() => {
        const { renderEventManager, resetHandler, nextHandler, errorHandler } =
          withNextObservableSetup(new BehaviorSubject('ngrx/component'));

        renderEventManager.nextPotentialObservable(
          timer(100).pipe(switchMap(() => throwError(() => 'ERROR!')))
        );

        // first observable
        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 'ngrx/component',
          reset: true,
        });

        // next observable
        expect(resetHandler).toHaveBeenCalledWith({
          type: 'reset',
          reset: true,
        });
        expect(errorHandler).not.toHaveBeenCalled();

        tick(100);

        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!',
          reset: false,
        });

        expect(resetHandler).toHaveBeenCalledTimes(1);
        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledTimes(1);
      }));

      it('should call complete handler immediately and error handler when error is emitted', fakeAsync(() => {
        const {
          renderEventManager,
          resetHandler,
          nextHandler,
          completeHandler,
        } = withNextObservableSetup(new BehaviorSubject(false));

        renderEventManager.nextPotentialObservable(
          timer(100).pipe(switchMap(() => EMPTY))
        );

        // first observable
        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: false,
          reset: true,
        });

        // next observable
        expect(resetHandler).toHaveBeenCalledWith({
          type: 'reset',
          reset: true,
        });
        expect(completeHandler).not.toHaveBeenCalled();

        tick(100);

        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: false,
        });

        expect(resetHandler).toHaveBeenCalledTimes(1);
        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(completeHandler).toHaveBeenCalledTimes(1);
      }));
    });

    describe('that never emits event', () => {
      it('should call reset handler', () => {
        const { renderEventManager, resetHandler, nextHandler } =
          withNextObservableSetup(new BehaviorSubject(10));

        renderEventManager.nextPotentialObservable(NEVER);
        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 10,
          reset: true,
        });
        expect(resetHandler).toHaveBeenCalledWith({
          type: 'reset',
          reset: true,
        });
      });

      it('should not call reset handler second time when first observable never emits', () => {
        const { renderEventManager, resetHandler } = withNextObservableSetup(
          new Observable()
        );

        renderEventManager.nextPotentialObservable(new Observable());
        expect(resetHandler).toHaveBeenCalledWith({
          type: 'reset',
          reset: true,
        });
        expect(resetHandler).toHaveBeenCalledTimes(1);
      });
    });
  });
});
