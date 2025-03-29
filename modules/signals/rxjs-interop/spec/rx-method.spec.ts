import {
  createEnvironmentInjector,
  EnvironmentInjector,
  Injectable,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, of, pipe, Subject, tap } from 'rxjs';
import { rxMethod } from '../src';
import { createLocalService } from '../../spec/helpers';

describe('rxMethod', () => {
  it('runs with a value', () => {
    const results: number[] = [];
    const method = TestBed.runInInjectionContext(() =>
      rxMethod<number>(pipe(tap((value) => results.push(value))))
    );

    method(1);
    expect(results.length).toBe(1);
    expect(results[0]).toBe(1);

    method(2);
    expect(results.length).toBe(2);
    expect(results[1]).toBe(2);
  });

  it('runs with an observable', () => {
    const results: string[] = [];
    const method = TestBed.runInInjectionContext(() =>
      rxMethod<string>(pipe(tap((value) => results.push(value))))
    );
    const subject$ = new Subject<string>();

    method(subject$);
    expect(results.length).toBe(0);

    subject$.next('ngrx');
    expect(results[0]).toBe('ngrx');

    subject$.next('rocks');
    expect(results[1]).toBe('rocks');
  });

  it('runs with a signal', () =>
    TestBed.runInInjectionContext(() => {
      const results: number[] = [];
      const method = rxMethod<number>(
        pipe(tap((value) => results.push(value)))
      );
      const sig = signal(1);

      method(sig);
      expect(results.length).toBe(0);

      TestBed.flushEffects();
      expect(results[0]).toBe(1);

      sig.set(10);
      expect(results.length).toBe(1);

      TestBed.flushEffects();
      expect(results[1]).toBe(10);
    }));

  it('runs with void input', () => {
    const results: number[] = [];
    const subject$ = new Subject<void>();
    const method = TestBed.runInInjectionContext(() =>
      rxMethod<void>(pipe(tap(() => results.push(1))))
    );

    method();
    expect(results.length).toBe(1);

    method(subject$);
    expect(results.length).toBe(1);

    subject$.next();
    expect(results.length).toBe(2);
  });

  it('manually unsubscribes from method instance', () =>
    TestBed.runInInjectionContext(() => {
      const results: number[] = [];
      const method = rxMethod<number>(
        pipe(tap((value) => results.push(value)))
      );
      const subject$ = new Subject<number>();
      const sig = signal(0);

      const ref1 = method(subject$);
      const ref2 = method(sig);
      expect(results).toEqual([]);

      subject$.next(1);
      sig.set(1);
      TestBed.flushEffects();
      expect(results).toEqual([1, 1]);

      ref1.destroy();
      subject$.next(2);
      sig.set(2);
      TestBed.flushEffects();
      expect(results).toEqual([1, 1, 2]);

      ref2.destroy();
      sig.set(3);
      TestBed.flushEffects();
      expect(results).toEqual([1, 1, 2]);
    }));

  it('manually unsubscribes from method and all instances', () => {
    const results: number[] = [];
    let destroyed = false;
    const method = TestBed.runInInjectionContext(() =>
      rxMethod<number>(
        pipe(
          tap({
            next: (value) => results.push(value),
            finalize: () => (destroyed = true),
          })
        )
      )
    );
    const subject1$ = new BehaviorSubject(1);
    const subject2$ = new BehaviorSubject(1);

    method(subject1$);
    method(subject2$);
    method(1);
    expect(results).toEqual([1, 1, 1]);

    method.destroy();
    expect(destroyed).toBe(true);

    subject1$.next(2);
    subject2$.next(2);
    method(2);
    expect(results).toEqual([1, 1, 1]);
  });

  it('unsubscribes from method and all instances on destroy', () => {
    const results: string[] = [];
    let destroyed = false;
    const subject$ = new BehaviorSubject('subject');
    const sig = signal('signal');

    @Injectable()
    class TestService {
      method = rxMethod<string>(
        pipe(
          tap({
            next: (value) => results.push(value),
            finalize: () => (destroyed = true),
          })
        )
      );
    }

    const { service, flush, destroy } = createLocalService(TestService);

    service.method(subject$);
    service.method(sig);
    service.method('value');

    flush();
    expect(results).toEqual(['subject', 'value', 'signal']);

    destroy();
    expect(destroyed).toBe(true);

    subject$.next('subject 2');
    sig.set('signal 2');
    service.method('value 2');

    flush();
    expect(results).toEqual(['subject', 'value', 'signal']);
  });

  it('throws an error when it is called out of injection context', () => {
    expect(() => rxMethod(($) => $)).toThrow(
      /NG0203: rxMethod\(\) can only be used within an injection context/
    );
  });

  it('allows signal updates', () => {
    const counter = signal(1);
    const increment = TestBed.runInInjectionContext(() =>
      rxMethod<number>(tap((n) => counter.update((value) => value + n)))
    );

    const num = signal(3);
    increment(num);

    TestBed.flushEffects();
    expect(counter()).toBe(4);
  });

  /**
   * This test suite verifies that a signal or observable passed to a reactive
   * method that is initialized at the ancestor injector level is tracked within
   * the correct injection context and untracked at the specified time.
   *
   * Different injection contexts use `globalSignal` or `globalObservable`
   * from `GlobalService` and pass it to the reactive method.
   * If the injector is destroyed but the signal or the observable still
   * increases the corresponding counter, the internal effect or subscription
   * is still active.
   */
  describe('with instance injector', () => {
    @Injectable({ providedIn: 'root' })
    class GlobalService {
      readonly globalSignal = signal(1);
      readonly globalObservable = new BehaviorSubject(1);

      globalSignalChangeCounter = 0;
      globalObservableChangeCounter = 0;

      readonly trackSignal = rxMethod<number>(
        tap(() => this.globalSignalChangeCounter++)
      );
      readonly trackObservable = rxMethod<number>(
        tap(() => this.globalObservableChangeCounter++)
      );

      incrementSignal(): void {
        this.globalSignal.update((value) => value + 1);
      }

      incrementObservable(): void {
        this.globalObservable.next(this.globalObservable.value + 1);
      }
    }

    it('tracks a signal until the instanceInjector is destroyed', () => {
      const instanceInjector = createEnvironmentInjector(
        [],
        TestBed.inject(EnvironmentInjector)
      );
      const globalService = TestBed.inject(GlobalService);
      runInInjectionContext(instanceInjector, () => {
        globalService.trackSignal(globalService.globalSignal);
      });

      TestBed.flushEffects();
      expect(globalService.globalSignalChangeCounter).toBe(1);

      globalService.incrementSignal();
      TestBed.flushEffects();
      expect(globalService.globalSignalChangeCounter).toBe(2);

      globalService.incrementSignal();
      TestBed.flushEffects();
      expect(globalService.globalSignalChangeCounter).toBe(3);

      instanceInjector.destroy();
      globalService.incrementSignal();
      TestBed.flushEffects();

      expect(globalService.globalSignalChangeCounter).toBe(3);
    });

    it('tracks an observable until the instanceInjector is destroyed', () => {
      const instanceInjector = createEnvironmentInjector(
        [],
        TestBed.inject(EnvironmentInjector)
      );
      const globalService = TestBed.inject(GlobalService);
      runInInjectionContext(instanceInjector, () =>
        globalService.trackObservable(globalService.globalObservable)
      );

      TestBed.flushEffects();
      expect(globalService.globalObservableChangeCounter).toBe(1);

      globalService.incrementObservable();
      expect(globalService.globalObservableChangeCounter).toBe(2);

      globalService.incrementObservable();
      expect(globalService.globalObservableChangeCounter).toBe(3);

      instanceInjector.destroy();
      globalService.incrementObservable();

      expect(globalService.globalObservableChangeCounter).toBe(3);
    });

    it('tracks a signal until the provided injector is destroyed', () => {
      const instanceInjector = createEnvironmentInjector(
        [],
        TestBed.inject(EnvironmentInjector)
      );
      const globalService = TestBed.inject(GlobalService);
      globalService.trackSignal(globalService.globalSignal, {
        injector: instanceInjector,
      });

      TestBed.flushEffects();
      globalService.incrementSignal();
      TestBed.flushEffects();

      expect(globalService.globalSignalChangeCounter).toBe(2);

      instanceInjector.destroy();
      globalService.incrementSignal();
      TestBed.flushEffects();

      expect(globalService.globalSignalChangeCounter).toBe(2);
    });

    it('tracks an observable until the provided injector is destroyed', async () => {
      const instanceInjector = createEnvironmentInjector(
        [],
        TestBed.inject(EnvironmentInjector)
      );
      const globalService = TestBed.inject(GlobalService);
      globalService.trackObservable(globalService.globalObservable, {
        injector: instanceInjector,
      });

      globalService.incrementObservable();
      expect(globalService.globalObservableChangeCounter).toBe(2);

      instanceInjector.destroy();
      globalService.incrementObservable();

      expect(globalService.globalObservableChangeCounter).toBe(2);
    });

    it('falls back to source injector when reactive method is called outside of the injection context', () => {
      const globalService = TestBed.inject(GlobalService);

      globalService.trackSignal(globalService.globalSignal);
      globalService.trackObservable(globalService.globalObservable);

      TestBed.flushEffects();
      expect(globalService.globalSignalChangeCounter).toBe(1);
      expect(globalService.globalObservableChangeCounter).toBe(1);

      globalService.incrementSignal();
      globalService.incrementObservable();
      TestBed.flushEffects();

      expect(globalService.globalSignalChangeCounter).toBe(2);
      expect(globalService.globalObservableChangeCounter).toBe(2);
    });
  });

  describe('warning on source injector', () => {
    const warnSpy = vitest.spyOn(console, 'warn');

    beforeEach(() => {
      warnSpy.mockReset();
    });

    const createAdder = (callback: (value: number) => void) =>
      TestBed.runInInjectionContext(() => rxMethod<number>(tap(callback)));

    it('does not warn on non-reactive value and source injector', () => {
      let a = 1;
      const adder = createAdder((value) => (a += value));
      adder(1);

      expect(warnSpy).not.toHaveBeenCalled();
    });

    for (const [reactiveValue, name] of [
      [signal(1), 'Signal'],
      [of(1), 'Observable'],
    ] as const) {
      describe(`${name}`, () => {
        it('warns when source injector is used', () => {
          let a = 1;
          const adder = createAdder((value) => (a += value));
          adder(reactiveValue);

          expect(warnSpy).toHaveBeenCalled();
          const warning = (warnSpy.mock.lastCall || []).join(' ');
          expect(warning).toMatch(
            /reactive method was called outside the injection context with a signal or observable/
          );
        });

        it('does not warn on manual injector', () => {
          let a = 1;
          const adder = createAdder((value) => (a += value));
          const injector = TestBed.inject(Injector);
          adder(reactiveValue, { injector });

          expect(warnSpy).not.toHaveBeenCalled();
        });

        it('does not warn if called within injection context', () => {
          let a = 1;
          const adder = createAdder((value) => (a += value));
          TestBed.runInInjectionContext(() => adder(reactiveValue));

          expect(warnSpy).not.toHaveBeenCalled();
        });
      });
    }
  });
});
