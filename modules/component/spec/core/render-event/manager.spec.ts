import { fakeAsync, tick } from '@angular/core/testing';
import {
  BehaviorSubject,
  delay,
  EMPTY,
  merge,
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
    const suspenseHandler = jest.fn();
    const nextHandler = jest.fn();
    const errorHandler = jest.fn();
    const completeHandler = jest.fn();
    const renderEventManager = createRenderEventManager<T>({
      suspense: suspenseHandler,
      next: nextHandler,
      error: errorHandler,
      complete: completeHandler,
    });
    renderEventManager.handlePotentialObservableChanges().subscribe();

    return {
      renderEventManager,
      suspenseHandler,
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
          synchronous: true,
        });
      });

      it('should call next handler with synchronous and without reset flag when another value is emitted synchronously', () => {
        const { renderEventManager, nextHandler } = setup<string>();

        renderEventManager.nextPotentialObservable(of('angular', 'ngrx'));
        expect(nextHandler.mock.calls[0][0]).toEqual({
          type: 'next',
          value: 'angular',
          reset: true,
          synchronous: true,
        });
        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 'ngrx',
          reset: false,
          synchronous: true,
        });
        expect(nextHandler).toHaveBeenCalledTimes(2);
      });

      it('should call next handler without reset and synchronous flags when another value is emitted asynchronously', () => {
        const { renderEventManager, nextHandler } = setup<string>();
        const subject = new BehaviorSubject('ngrx');

        renderEventManager.nextPotentialObservable(subject);
        subject.next('angular');

        expect(nextHandler.mock.calls[0][0]).toEqual({
          type: 'next',
          value: 'ngrx',
          reset: true,
          synchronous: true,
        });
        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 'angular',
          reset: false,
          synchronous: false,
        });
        expect(nextHandler).toHaveBeenCalledTimes(2);
      });

      it('should not call next handler second time when same value is emitted twice synchronously', () => {
        const { renderEventManager, nextHandler } = setup<string>();

        renderEventManager.nextPotentialObservable(
          of('ngrx', 'component', 'component')
        );
        expect(nextHandler.mock.calls[0][0]).toEqual({
          type: 'next',
          value: 'ngrx',
          reset: true,
          synchronous: true,
        });
        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 'component',
          reset: false,
          synchronous: true,
        });
        expect(nextHandler).toHaveBeenCalledTimes(2);
      });

      it('should not call next handler second time when same value is emitted twice asynchronously', fakeAsync(() => {
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
          synchronous: true,
        });
        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 'ngrx/component',
          reset: false,
          synchronous: false,
        });
        expect(nextHandler).toHaveBeenCalledTimes(2);
      }));

      it('should not call next handler second time when same value is emitted first synchronously then asynchronously', fakeAsync(() => {
        const { renderEventManager, nextHandler } = setup<string>();

        renderEventManager.nextPotentialObservable(
          merge(
            of('ngrx', 'component'),
            timer(10).pipe(switchMap(() => of('component')))
          )
        );
        tick(10);

        expect(nextHandler.mock.calls[0][0]).toEqual({
          type: 'next',
          value: 'ngrx',
          reset: true,
          synchronous: true,
        });
        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 'component',
          reset: false,
          synchronous: true,
        });
        expect(nextHandler).toHaveBeenCalledTimes(2);
      }));

      it('should call error handler with reset and synchronous flags when error is emitted', () => {
        const { renderEventManager, errorHandler } = setup<number>();

        renderEventManager.nextPotentialObservable(throwError(() => 'ERROR!'));
        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!',
          reset: true,
          synchronous: true,
        });
      });

      it('should call error handler with synchronous and without reset flag when error is emitted synchronously as second event', () => {
        const { renderEventManager, errorHandler, nextHandler } =
          setup<number>();

        renderEventManager.nextPotentialObservable(
          new Observable<number>((subscriber) => {
            subscriber.next(1);
            subscriber.error('ERROR!!!');
          })
        );

        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 1,
          reset: true,
          synchronous: true,
        });
        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!!!',
          reset: false,
          synchronous: true,
        });

        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledTimes(1);
      });

      it('should call error handler without reset and synchronous flags when error is emitted asynchronously as second event', () => {
        const { renderEventManager, errorHandler, nextHandler } =
          setup<number>();
        const subject = new BehaviorSubject(100);

        renderEventManager.nextPotentialObservable(subject);
        subject.error('ERROR!');

        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 100,
          reset: true,
          synchronous: true,
        });
        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!',
          reset: false,
          synchronous: false,
        });

        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledTimes(1);
      });

      it('should call complete handler with reset and synchronous flags when complete is emitted', () => {
        const { renderEventManager, completeHandler } = setup<boolean>();

        renderEventManager.nextPotentialObservable(EMPTY);
        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: true,
          synchronous: true,
        });
      });

      it('should call complete handler with synchronous and without reset flag when complete is emitted synchronously as second event', () => {
        const { renderEventManager, nextHandler, completeHandler } =
          setup<number>();

        renderEventManager.nextPotentialObservable(of(100));

        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 100,
          reset: true,
          synchronous: true,
        });
        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: false,
          synchronous: true,
        });

        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(completeHandler).toHaveBeenCalledTimes(1);
      });

      it('should call complete handler without reset and synchronous flags when complete is emitted asynchronously as second event', () => {
        const { renderEventManager, nextHandler, completeHandler } =
          setup<boolean>();
        const subject = new BehaviorSubject(true);

        renderEventManager.nextPotentialObservable(subject);
        subject.complete();

        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: true,
          reset: true,
          synchronous: true,
        });
        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: false,
          synchronous: false,
        });

        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(completeHandler).toHaveBeenCalledTimes(1);
      });
    });

    describe('that emits first event asynchronously', () => {
      it('should call suspense handler immediately and next handler when value is emitted', fakeAsync(() => {
        const { renderEventManager, suspenseHandler, nextHandler } =
          setup<string>();

        renderEventManager.nextPotentialObservable(of('ngrx').pipe(delay(100)));

        expect(suspenseHandler).toHaveBeenCalledWith({
          type: 'suspense',
          reset: true,
          synchronous: true,
        });
        expect(nextHandler).not.toHaveBeenCalled();

        tick(100);

        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 'ngrx',
          reset: false,
          synchronous: false,
        });
      }));

      it('should call suspense handler immediately and error handler when error is emitted', fakeAsync(() => {
        const { renderEventManager, suspenseHandler, errorHandler } =
          setup<number>();

        renderEventManager.nextPotentialObservable(
          timer(100).pipe(switchMap(() => throwError(() => 'ERROR!')))
        );

        expect(suspenseHandler).toHaveBeenCalledWith({
          type: 'suspense',
          reset: true,
          synchronous: true,
        });
        expect(errorHandler).not.toHaveBeenCalled();

        tick(100);

        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!',
          reset: false,
          synchronous: false,
        });
      }));

      it('should call suspense handler immediately and complete handler when complete is emitted', fakeAsync(() => {
        const { renderEventManager, suspenseHandler, completeHandler } =
          setup<boolean>();

        renderEventManager.nextPotentialObservable(
          timer(100).pipe(switchMap(() => EMPTY))
        );

        expect(suspenseHandler).toHaveBeenCalledWith({
          type: 'suspense',
          reset: true,
          synchronous: true,
        });
        expect(completeHandler).not.toHaveBeenCalled();

        tick(100);

        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: false,
          synchronous: false,
        });
      }));
    });

    describe('that never emits event', () => {
      it('should call suspense handler', () => {
        const { renderEventManager, suspenseHandler } = setup();

        renderEventManager.nextPotentialObservable(NEVER);
        expect(suspenseHandler).toHaveBeenCalledWith({
          type: 'suspense',
          reset: true,
          synchronous: true,
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
      it('should call next handler with reset and synchronous flags when first value is emitted', () => {
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
          synchronous: true,
        });

        // next observable
        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 100,
          reset: true,
          synchronous: true,
        });
        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: false,
          synchronous: true,
        });

        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledTimes(1);
        expect(completeHandler).toHaveBeenCalledTimes(1);
      });

      it('should call next handler with synchronous and without reset flag when another value is emitted synchronously', () => {
        const { renderEventManager, nextHandler } = withNextObservableSetup(
          new BehaviorSubject(1)
        );

        renderEventManager.nextPotentialObservable(
          new Observable((subscriber) => {
            subscriber.next(10);
            subscriber.next(100);
          })
        );

        // first observable
        expect(nextHandler.mock.calls[0][0]).toEqual({
          type: 'next',
          value: 1,
          reset: true,
          synchronous: true,
        });

        // next observable
        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 10,
          reset: true,
          synchronous: true,
        });
        expect(nextHandler.mock.calls[2][0]).toEqual({
          type: 'next',
          value: 100,
          reset: false,
          synchronous: true,
        });

        expect(nextHandler).toHaveBeenCalledTimes(3);
      });

      it('should call next handler without reset and synchronous flags when another value is emitted asynchronously', () => {
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
          synchronous: true,
        });

        // next observable
        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 10,
          reset: true,
          synchronous: true,
        });
        expect(nextHandler.mock.calls[2][0]).toEqual({
          type: 'next',
          value: 100,
          reset: false,
          synchronous: false,
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
          synchronous: true,
        });
        expect(nextHandler).toHaveBeenCalledTimes(1);
      });

      it('should call error handler with reset and synchronous flags when error is emitted', () => {
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
          synchronous: true,
        });
        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: false,
          synchronous: true,
        });

        // next observable
        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!',
          reset: true,
          synchronous: true,
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
          synchronous: true,
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
          synchronous: true,
        });
        expect(completeHandler.mock.calls[0][0]).toEqual({
          type: 'complete',
          reset: false,
          synchronous: true,
        });

        // next observable
        expect(completeHandler.mock.calls[1][0]).toEqual({
          type: 'complete',
          reset: true,
          synchronous: true,
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
          synchronous: true,
        });
        expect(completeHandler).toHaveBeenCalledTimes(1);
      });
    });

    describe('that emits first event asynchronously', () => {
      it('should call suspense handler immediately and next handler when value is emitted', fakeAsync(() => {
        const { renderEventManager, suspenseHandler, nextHandler } =
          withNextObservableSetup(of('ngrx'));

        renderEventManager.nextPotentialObservable(
          of('component').pipe(delay(100))
        );

        // first observable
        expect(nextHandler.mock.calls[0][0]).toEqual({
          type: 'next',
          value: 'ngrx',
          reset: true,
          synchronous: true,
        });

        // next observable
        expect(suspenseHandler).toHaveBeenCalledWith({
          type: 'suspense',
          reset: true,
          synchronous: true,
        });
        expect(nextHandler.mock.calls[1]).not.toBeDefined();

        tick(100);

        expect(nextHandler.mock.calls[1][0]).toEqual({
          type: 'next',
          value: 'component',
          reset: false,
          synchronous: false,
        });

        expect(suspenseHandler).toHaveBeenCalledTimes(1);
        expect(nextHandler).toHaveBeenCalledTimes(2);
      }));

      it('should call suspense handler immediately and error handler when error is emitted', fakeAsync(() => {
        const {
          renderEventManager,
          suspenseHandler,
          nextHandler,
          errorHandler,
        } = withNextObservableSetup(new BehaviorSubject('ngrx/component'));

        renderEventManager.nextPotentialObservable(
          timer(100).pipe(switchMap(() => throwError(() => 'ERROR!')))
        );

        // first observable
        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 'ngrx/component',
          reset: true,
          synchronous: true,
        });

        // next observable
        expect(suspenseHandler).toHaveBeenCalledWith({
          type: 'suspense',
          reset: true,
          synchronous: true,
        });
        expect(errorHandler).not.toHaveBeenCalled();

        tick(100);

        expect(errorHandler).toHaveBeenCalledWith({
          type: 'error',
          error: 'ERROR!',
          reset: false,
          synchronous: false,
        });

        expect(suspenseHandler).toHaveBeenCalledTimes(1);
        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(errorHandler).toHaveBeenCalledTimes(1);
      }));

      it('should call suspense handler immediately and complete handler when complete is emitted', fakeAsync(() => {
        const {
          renderEventManager,
          suspenseHandler,
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
          synchronous: true,
        });

        // next observable
        expect(suspenseHandler).toHaveBeenCalledWith({
          type: 'suspense',
          reset: true,
          synchronous: true,
        });
        expect(completeHandler).not.toHaveBeenCalled();

        tick(100);

        expect(completeHandler).toHaveBeenCalledWith({
          type: 'complete',
          reset: false,
          synchronous: false,
        });

        expect(suspenseHandler).toHaveBeenCalledTimes(1);
        expect(nextHandler).toHaveBeenCalledTimes(1);
        expect(completeHandler).toHaveBeenCalledTimes(1);
      }));
    });

    describe('that never emits event', () => {
      it('should call suspense handler', () => {
        const { renderEventManager, suspenseHandler, nextHandler } =
          withNextObservableSetup(new BehaviorSubject(10));

        renderEventManager.nextPotentialObservable(NEVER);
        expect(nextHandler).toHaveBeenCalledWith({
          type: 'next',
          value: 10,
          reset: true,
          synchronous: true,
        });
        expect(suspenseHandler).toHaveBeenCalledWith({
          type: 'suspense',
          reset: true,
          synchronous: true,
        });
      });

      it('should not call suspense handler second time when first observable never emits', () => {
        const { renderEventManager, suspenseHandler } = withNextObservableSetup(
          new Observable()
        );

        renderEventManager.nextPotentialObservable(new Observable());
        expect(suspenseHandler).toHaveBeenCalledWith({
          type: 'suspense',
          reset: true,
          synchronous: true,
        });
        expect(suspenseHandler).toHaveBeenCalledTimes(1);
      });
    });
  });
});
