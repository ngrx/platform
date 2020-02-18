import { processCdAwareObservables } from '../../../src/core/operators';
import { EMPTY, Observable, of, pipe, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ArgumentNotObservableError } from '../../../src/core/utils';

describe('processCdAwareObservables', () => {
  it('should work as RxJS operator', () => {
    const empty: Observable<Observable<any>> = EMPTY;
    const source: Observable<Observable<any>> = empty.pipe(
      processCdAwareObservables(o$ => o$, o$ => o$, o$ => o$)
    );
    const complete: jasmine.Spy = jasmine.createSpy('complete');
    source.subscribe({
      complete: complete,
    });
    expect(complete).toHaveBeenCalled();
  });

  describe('that mirror type safety from toObservableValue', () => {
    it('should take observables', () => {
      const observable: Observable<Observable<never>> = of(EMPTY);
      const complete: jasmine.Spy = jasmine.createSpy('complete');
      observable
        .pipe(processCdAwareObservables(o$ => o$, o$ => o$, o$ => o$))
        .subscribe({
          complete: complete,
        });
      expect(complete).toHaveBeenCalled();
    });

    it('should take a promise', () => {
      const observable: Observable<Promise<any>> = of(Promise.resolve(42));
      observable
        .pipe(processCdAwareObservables(o$ => o$, o$ => o$, o$ => o$))
        .subscribe(v => expect(v).toBe(42));
    });

    it('should take a undefined', () => {
      const observable: Observable<any> = of(undefined);
      const next: jasmine.Spy = jasmine.createSpy('complete');
      const complete: jasmine.Spy = jasmine.createSpy('complete');
      observable
        .pipe(processCdAwareObservables(o$ => o$, o$ => o$, o$ => o$))
        .subscribe({
          next: next,
          complete: complete,
        });
      expect(next).toHaveBeenCalledWith(undefined);
      expect(complete).toHaveBeenCalled();
    });

    it('should take a null', () => {
      const observable: Observable<any> = of(null);
      const next: jasmine.Spy = jasmine.createSpy('complete');
      const complete: jasmine.Spy = jasmine.createSpy('complete');
      observable
        .pipe(processCdAwareObservables(o$ => o$, o$ => o$, o$ => o$))
        .subscribe({
          next: next,
          complete: complete,
        });
      expect(next).toHaveBeenCalledWith(null);
      expect(complete).toHaveBeenCalled();
    });

    it('throw if no observable, promise, undefined or null is passed', () => {
      const observable: Observable<any> = of(
        throwError(ArgumentNotObservableError)
      );
      observable
        .pipe(processCdAwareObservables(o$ => o$, o$ => o$, o$ => o$))
        .subscribe({
          error(e) {
            expect(e).toBe(ArgumentNotObservableError);
          },
        });
    });
  });

  it('should forward emitted values form an observable', () => {
    const observable: Observable<Observable<number>> = of(of(42));
    observable
      .pipe(processCdAwareObservables(o$ => o$, o$ => o$, o$ => o$))
      .subscribe(val => {
        expect(val).toBe(42);
      });
  });

  it('should forward emitted errors form an observable', () => {
    const observable: Observable<Observable<number>> = of(
      throwError(ArgumentNotObservableError)
    );
    observable
      .pipe(processCdAwareObservables(o$ => o$, o$ => o$, o$ => o$))
      .subscribe({
        error(e) {
          expect(e).toBe(ArgumentNotObservableError);
        },
      });
  });

  it('should forward emitted values form a promise', () => {
    const observable: Observable<Promise<number>> = of(Promise.resolve(42));
    observable
      .pipe(processCdAwareObservables(o$ => o$, o$ => o$, o$ => o$))
      .subscribe(val => {
        expect(val).toBe(42);
      });
  });

  it('should forward emitted errors form a promise', () => {
    const observable: Observable<Promise<number>> = of(
      Promise.reject(ArgumentNotObservableError)
    );
    observable
      .pipe(processCdAwareObservables(o$ => o$, o$ => o$, o$ => o$))
      .subscribe({
        error(e) {
          expect(e).toBe(ArgumentNotObservableError);
        },
      });
  });

  describe('implement applied behaviours correctly', () => {
    it('should run resetContextBehaviour on new observableValue', () => {
      const empty: Observable<any> = of(EMPTY);
      const observableValues: Observable<Observable<any>> = of(empty);
      const nextCallback: jasmine.Spy = jasmine.createSpy('nextCallback');
      const resetContextBehaviour = pipe(tap(nextCallback));
      observableValues
        .pipe(
          processCdAwareObservables(resetContextBehaviour, o$ => o$, o$ => o$)
        )
        .subscribe();

      expect(nextCallback).toHaveBeenCalled();
    });

    it('should run updateContextBehaviour on new emitted observable', () => {
      const empty: Observable<any> = of(EMPTY);
      const observableValues: Observable<Observable<any>> = of(empty);
      const nextCallback: jasmine.Spy = jasmine.createSpy('nextCallback');
      const errorCallback: jasmine.Spy = jasmine.createSpy('errorCallback');
      const completeCallback: jasmine.Spy = jasmine.createSpy(
        'completeCallback'
      );
      const updateContextBehaviour = pipe(
        tap(nextCallback, errorCallback, completeCallback)
      );
      observableValues
        .pipe(
          processCdAwareObservables(o$ => o$, updateContextBehaviour, o$ => o$)
        )
        .subscribe();

      expect(nextCallback).toHaveBeenCalled();
    });

    it('should run updateContextBehaviour on new emitted value', () => {
      const observableValues: Observable<Observable<any>> = of(of(42));
      const nextCallback: jasmine.Spy = jasmine.createSpy('nextCallback');
      const errorCallback: jasmine.Spy = jasmine.createSpy('errorCallback');
      const completeCallback: jasmine.Spy = jasmine.createSpy(
        'completeCallback'
      );
      const updateContextBehaviour = map((o$: Observable<any>) =>
        o$.pipe(tap(nextCallback, errorCallback, completeCallback))
      );
      observableValues
        .pipe(
          processCdAwareObservables(o$ => o$, updateContextBehaviour, o$ => o$)
        )
        .subscribe();

      expect(nextCallback).toHaveBeenCalledWith(42);
    });

    it('should apply configurableContextBehaviour on new observableValue', () => {
      const observableValues: Observable<Observable<any>> = of(of(EMPTY));
      const nextCallback: jasmine.Spy = jasmine.createSpy('nextCallback');
      const configurableContextBehaviour = pipe(tap(nextCallback));
      observableValues
        .pipe(
          processCdAwareObservables(
            o$ => o$,
            o$ => o$,
            configurableContextBehaviour
          )
        )
        .subscribe();

      expect(nextCallback).toHaveBeenCalled();
    });

    it('should run configured context behaviour on new emitted value', () => {
      const observableValues: Observable<Observable<any>> = of(of(42));
      const nextCallback: jasmine.Spy = jasmine.createSpy('nextCallback');
      const configurableContextBehaviour = (o: Observable<any>) =>
        o.pipe(map(oo => oo.pipe(tap(nextCallback))));
      observableValues
        .pipe(
          processCdAwareObservables(
            o$ => o$,
            o$ => o$,
            configurableContextBehaviour
          )
        )
        .subscribe();
      expect(nextCallback).toHaveBeenCalled();
    });
  });
});
