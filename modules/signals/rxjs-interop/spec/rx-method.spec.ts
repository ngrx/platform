import {
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { BehaviorSubject, pipe, Subject, tap } from 'rxjs';
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

      const sub1 = method(subject$);
      const sub2 = method(sig);
      expect(results).toEqual([]);

      subject$.next(1);
      sig.set(1);
      TestBed.flushEffects();
      expect(results).toEqual([1, 1]);

      sub1.unsubscribe();
      subject$.next(2);
      sig.set(2);
      TestBed.flushEffects();
      expect(results).toEqual([1, 1, 2]);

      sub2.unsubscribe();
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

    method.unsubscribe();
    expect(destroyed).toBe(true);

    subject1$.next(2);
    subject2$.next(2);
    method(2);
    expect(results).toEqual([1, 1, 1]);
  });

  it('unsubscribes from method and all instances on destroy', () => {
    const results: number[] = [];
    let destroyed = false;
    const subject$ = new BehaviorSubject(1);
    const sig = signal(1);

    @Injectable()
    class TestService {
      method = rxMethod<number>(
        pipe(
          tap({
            next: (value) => results.push(value),
            finalize: () => (destroyed = true),
          })
        )
      );
    }

    const { service, flushEffects, destroy } = createLocalService(TestService);

    service.method(subject$);
    service.method(sig);
    service.method(1);
    flushEffects();
    expect(results).toEqual([1, 1, 1]);

    destroy();
    expect(destroyed).toBe(true);

    subject$.next(2);
    sig.set(2);
    service.method(2);
    flushEffects();
    expect(results).toEqual([1, 1, 1]);
  });

  it('unsubscribes from method and all instances on provided injector destroy', () => {
    const injector = createEnvironmentInjector(
      [],
      TestBed.inject(EnvironmentInjector)
    );
    const results: number[] = [];
    let destroyed = false;

    const method = rxMethod<number>(
      tap({
        next: (value) => results.push(value),
        finalize: () => (destroyed = true),
      }),
      { injector }
    );

    const subject$ = new BehaviorSubject(1);
    const sig = signal(1);

    method(subject$);
    method(sig);
    method(1);

    TestBed.flushEffects();
    expect(results).toEqual([1, 1, 1]);

    injector.destroy();
    expect(destroyed).toBe(true);

    subject$.next(2);
    sig.set(2);
    method(2);

    TestBed.flushEffects();
    expect(results).toEqual([1, 1, 1]);
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
   * Components use `globalSignal` or `globalObservable` from `GlobalService`
   * and pass it to the reactive method. If the component is destroyed but
   * signal or observable change still increases the corresponding counter,
   * the internal effect or subscription is still active.
   */
  describe('with instance injector', () => {
    @Injectable({ providedIn: 'root' })
    class GlobalService {
      readonly globalSignal = signal(1);
      readonly globalObservable = new BehaviorSubject(1);

      globalSignalChangeCounter = 0;
      globalObservableChangeCounter = 0;

      readonly signalMethod = rxMethod<number>(
        tap(() => this.globalSignalChangeCounter++)
      );
      readonly observableMethod = rxMethod<number>(
        tap(() => this.globalObservableChangeCounter++)
      );

      incrementSignal(): void {
        this.globalSignal.update((value) => value + 1);
      }

      incrementObservable(): void {
        this.globalObservable.next(this.globalObservable.value + 1);
      }
    }

    @Component({
      selector: 'app-without-store',
      template: '',
      standalone: true,
    })
    class WithoutStoreComponent {}

    function setup(WithStoreComponent: new () => unknown): GlobalService {
      TestBed.configureTestingModule({
        providers: [
          provideRouter([
            { path: 'with-store', component: WithStoreComponent },
            {
              path: 'without-store',
              component: WithoutStoreComponent,
            },
          ]),
          provideLocationMocks(),
        ],
      });

      return TestBed.inject(GlobalService);
    }

    it('tracks a signal until the component is destroyed', async () => {
      @Component({
        selector: 'app-with-store',
        template: '',
        standalone: true,
      })
      class WithStoreComponent {
        store = inject(GlobalService);

        constructor() {
          this.store.signalMethod(this.store.globalSignal);
        }
      }

      const globalService = setup(WithStoreComponent);
      const harness = await RouterTestingHarness.create('/with-store');

      expect(globalService.globalSignalChangeCounter).toBe(1);

      globalService.incrementSignal();
      TestBed.flushEffects();
      expect(globalService.globalSignalChangeCounter).toBe(2);

      globalService.incrementSignal();
      TestBed.flushEffects();
      expect(globalService.globalSignalChangeCounter).toBe(3);

      await harness.navigateByUrl('/without-store');
      globalService.incrementSignal();
      TestBed.flushEffects();

      expect(globalService.globalSignalChangeCounter).toBe(3);
    });

    it('tracks an observable until the component is destroyed', async () => {
      @Component({
        selector: 'app-with-store',
        template: '',
        standalone: true,
      })
      class WithStoreComponent {
        store = inject(GlobalService);

        constructor() {
          this.store.observableMethod(this.store.globalObservable);
        }
      }

      const globalService = setup(WithStoreComponent);
      const harness = await RouterTestingHarness.create('/with-store');

      expect(globalService.globalObservableChangeCounter).toBe(1);

      globalService.incrementObservable();
      expect(globalService.globalObservableChangeCounter).toBe(2);

      globalService.incrementObservable();
      expect(globalService.globalObservableChangeCounter).toBe(3);

      await harness.navigateByUrl('/without-store');
      globalService.incrementObservable();

      expect(globalService.globalObservableChangeCounter).toBe(3);
    });

    it('tracks a signal until the provided injector is destroyed', async () => {
      @Component({
        selector: 'app-with-store',
        template: '',
        standalone: true,
      })
      class WithStoreComponent implements OnInit {
        store = inject(GlobalService);
        injector = inject(Injector);

        ngOnInit() {
          this.store.signalMethod(this.store.globalSignal, {
            injector: this.injector,
          });
        }
      }

      const globalService = setup(WithStoreComponent);
      const harness = await RouterTestingHarness.create('/with-store');

      globalService.incrementSignal();
      TestBed.flushEffects();

      expect(globalService.globalSignalChangeCounter).toBe(2);

      await harness.navigateByUrl('/without-store');
      globalService.incrementSignal();
      TestBed.flushEffects();

      expect(globalService.globalSignalChangeCounter).toBe(2);
    });

    it('tracks an observable until the provided injector is destroyed', async () => {
      @Component({
        selector: 'app-with-store',
        template: '',
        standalone: true,
      })
      class WithStoreComponent implements OnInit {
        store = inject(GlobalService);
        injector = inject(Injector);

        ngOnInit() {
          this.store.observableMethod(this.store.globalObservable, {
            injector: this.injector,
          });
        }
      }

      const globalService = setup(WithStoreComponent);
      const harness = await RouterTestingHarness.create('/with-store');

      globalService.incrementObservable();

      expect(globalService.globalObservableChangeCounter).toBe(2);

      await harness.navigateByUrl('/without-store');
      globalService.incrementObservable();

      expect(globalService.globalObservableChangeCounter).toBe(2);
    });

    it('falls back to source injector when reactive method is called outside of the injection context', async () => {
      @Component({
        selector: 'app-with-store',
        template: '',
        standalone: true,
      })
      class WithStoreComponent implements OnInit {
        store = inject(GlobalService);

        ngOnInit() {
          this.store.signalMethod(this.store.globalSignal);
          this.store.observableMethod(this.store.globalObservable);
        }
      }

      const globalService = setup(WithStoreComponent);
      const harness = await RouterTestingHarness.create('/with-store');

      expect(globalService.globalSignalChangeCounter).toBe(1);
      expect(globalService.globalObservableChangeCounter).toBe(1);

      await harness.navigateByUrl('/without-store');
      globalService.incrementSignal();
      TestBed.flushEffects();
      globalService.incrementObservable();

      expect(globalService.globalSignalChangeCounter).toBe(2);
      expect(globalService.globalObservableChangeCounter).toBe(2);
    });
  });
});
