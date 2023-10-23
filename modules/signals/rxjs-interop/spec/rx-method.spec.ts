import { Injectable, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, pipe, Subject, tap } from 'rxjs';
import { rxMethod } from '../src';
import { createLocalService, testEffects } from '../../spec/helpers';

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

  it(
    'runs with a signal',
    testEffects((tick) => {
      const results: number[] = [];
      const method = rxMethod<number>(
        pipe(tap((value) => results.push(value)))
      );
      const sig = signal(1);

      method(sig);
      expect(results.length).toBe(0);

      tick();
      expect(results[0]).toBe(1);

      sig.set(10);
      expect(results.length).toBe(1);

      tick();
      expect(results[1]).toBe(10);
    })
  );

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

  it(
    'manually unsubscribes from method instance',
    testEffects((tick) => {
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
      tick();
      expect(results).toEqual([1, 1]);

      sub1.unsubscribe();
      subject$.next(2);
      sig.set(2);
      tick();
      expect(results).toEqual([1, 1, 2]);

      sub2.unsubscribe();
      sig.set(3);
      tick();
      expect(results).toEqual([1, 1, 2]);
    })
  );

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

    const { service, tick, destroy } = createLocalService(TestService);

    service.method(subject$);
    service.method(sig);
    service.method(1);
    tick();
    expect(results).toEqual([1, 1, 1]);

    destroy();
    expect(destroyed).toBe(true);

    subject$.next(2);
    sig.set(2);
    service.method(2);
    tick();
    expect(results).toEqual([1, 1, 1]);
  });

  it('throws an error when it is called out of injection context', () => {
    expect(() => rxMethod(($) => $)).toThrow(
      /NG0203: rxMethod\(\) can only be used within an injection context/
    );
  });
});
