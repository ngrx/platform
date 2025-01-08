import { signalMethod } from '../src';
import { TestBed } from '@angular/core/testing';
import {
  createEnvironmentInjector,
  EnvironmentInjector,
  runInInjectionContext,
  signal,
} from '@angular/core';

describe('signalMethod', () => {
  const createAdder = (processingFn: (value: number) => void) =>
    TestBed.runInInjectionContext(() => signalMethod<number>(processingFn));

  it('processes a non-signal input', () => {
    let a = 1;
    const adder = createAdder((value) => (a += value));
    adder(2);
    expect(a).toBe(3);
  });

  it('processes a signal input', () => {
    let a = 1;
    const summand = signal(1);
    const adder = createAdder((value) => (a += value));

    adder(summand);
    expect(a).toBe(1);

    TestBed.flushEffects();
    expect(a).toBe(2);

    summand.set(2);
    summand.set(2);
    TestBed.flushEffects();
    expect(a).toBe(4);

    TestBed.flushEffects();
    expect(a).toBe(4);
  });

  it('throws if is a not created in an injection context', () => {
    expect(() => signalMethod<void>(() => void true)).toThrowError();
  });

  describe('destroying signalMethod', () => {
    it('stops signal tracking, when signalMethod gets destroyed', () => {
      let a = 1;
      const summand = signal(1);
      const adder = createAdder((value) => (a += value));
      adder(summand);

      summand.set(2);
      TestBed.flushEffects();
      expect(a).toBe(3);

      adder.destroy();

      summand.set(2);
      TestBed.flushEffects();
      expect(a).toBe(3);
    });

    it('can also destroy a signalMethod that processes non-signal inputs', () => {
      const adder = createAdder(() => void true);
      expect(() => adder(1).destroy()).not.toThrowError();
    });

    it('stops tracking all signals on signalMethod destroy', () => {
      let a = 1;
      const summand1 = signal(1);
      const summand2 = signal(2);
      const adder = createAdder((value) => (a += value));
      adder(summand1);
      adder(summand2);
      TestBed.flushEffects();
      expect(a).toBe(4);

      adder.destroy();

      summand1.set(2);
      summand2.set(3);
      TestBed.flushEffects();
      expect(a).toBe(4);
    });

    it('does not cause issues if destroyed signalMethodFn contains destroyed effectRefs', () => {
      let a = 1;
      const summand1 = signal(1);
      const summand2 = signal(2);
      const adder = createAdder((value) => (a += value));

      const childInjector = createEnvironmentInjector(
        [],
        TestBed.inject(EnvironmentInjector)
      );

      adder(summand1, { injector: childInjector });
      adder(summand2);

      TestBed.flushEffects();
      expect(a).toBe(4);
      childInjector.destroy();

      summand1.set(2);
      summand2.set(2);
      TestBed.flushEffects();

      adder.destroy();
      expect(a).toBe(4);
    });

    it('uses the provided injector (source injector) on creation', () => {
      let a = 1;
      const sourceInjector = createEnvironmentInjector(
        [],
        TestBed.inject(EnvironmentInjector)
      );
      const adder = signalMethod((value: number) => (a += value), {
        injector: sourceInjector,
      });
      const value = signal(1);

      adder(value);
      TestBed.flushEffects();

      sourceInjector.destroy();
      value.set(2);
      TestBed.flushEffects();

      expect(a).toBe(2);
    });

    it('prioritizes the provided caller injector over source injector', () => {
      let a = 1;
      const callerInjector = createEnvironmentInjector(
        [],
        TestBed.inject(EnvironmentInjector)
      );
      const sourceInjector = createEnvironmentInjector(
        [],
        TestBed.inject(EnvironmentInjector)
      );
      const adder = signalMethod((value: number) => (a += value), {
        injector: sourceInjector,
      });
      const value = signal(1);

      TestBed.runInInjectionContext(() => {
        adder(value, { injector: callerInjector });
      });
      TestBed.flushEffects();
      expect(a).toBe(2);

      sourceInjector.destroy();
      value.set(2);
      TestBed.flushEffects();

      expect(a).toBe(4);
    });

    it('prioritizes the provided injector over source and caller injector', () => {
      let a = 1;
      const callerInjector = createEnvironmentInjector(
        [],
        TestBed.inject(EnvironmentInjector)
      );
      const sourceInjector = createEnvironmentInjector(
        [],
        TestBed.inject(EnvironmentInjector)
      );
      const providedInjector = createEnvironmentInjector(
        [],
        TestBed.inject(EnvironmentInjector)
      );

      const adder = signalMethod((value: number) => (a += value), {
        injector: sourceInjector,
      });
      const value = signal(1);

      runInInjectionContext(callerInjector, () =>
        adder(value, { injector: providedInjector })
      );
      TestBed.flushEffects();
      expect(a).toBe(2);

      sourceInjector.destroy();
      value.set(2);
      TestBed.flushEffects();
      expect(a).toBe(4);

      callerInjector.destroy();
      value.set(1);
      TestBed.flushEffects();
      expect(a).toBe(5);
    });
  });

  it('stops specific tracking when calling destroy manually on an instance', () => {
    let a = 1;
    const summand1 = signal(1);
    const summand2 = signal(2);
    const adder = createAdder((value) => (a += value));
    adder(summand1);
    const s2 = adder(summand2);

    TestBed.flushEffects();
    s2.destroy();
    expect(a).toBe(4);

    summand1.set(100);
    summand2.set(3000);

    TestBed.flushEffects();
    expect(a).toBe(104);
  });
});
