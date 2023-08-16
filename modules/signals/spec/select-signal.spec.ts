import { effect, isSignal, signal } from '@angular/core';
import { selectSignal } from '../src';
import { testEffects } from './helpers';

describe('selectSignal', () => {
  it('creates a signal from provided projector function', () => {
    const s1 = signal(1);
    const s2 = selectSignal(() => s1() + 1);

    expect(isSignal(s2)).toBe(true);
    expect(s2()).toBe(2);

    s1.set(2);

    expect(s2()).toBe(3);
  });

  it('creates a signal from provided signals dictionary', () => {
    const s1 = signal(1);
    const s2 = signal(2);
    const s3 = selectSignal({ s1, s2 });

    expect(isSignal(s3)).toBe(true);
    expect(s3()).toEqual({ s1: 1, s2: 2 });

    s1.set(10);

    expect(s3()).toEqual({ s1: 10, s2: 2 });

    s1.set(100);
    s2.set(20);

    expect(s3()).toEqual({ s1: 100, s2: 20 });
  });

  it('creates a signal by combining provided signals', () => {
    const s1 = signal(1);
    const s2 = signal(2);
    const s3 = selectSignal(s1, s2, (v1, v2) => v1 + v2);

    expect(isSignal(s3)).toBe(true);
    expect(s3()).toBe(3);

    s1.set(10);

    expect(s3()).toBe(12);

    s1.set(100);
    s2.set(20);

    expect(s3()).toBe(120);
  });

  it(
    'uses default equality function when custom one is not provided',
    testEffects((tick) => {
      const initialState = { x: { y: { z: 1 }, k: 2 }, l: 3 };
      const state = signal(initialState);

      const x = selectSignal(() => state().x);
      const y = selectSignal(x, (x) => x.y);
      const z = selectSignal(y, (y) => y.z);
      const k = selectSignal(x, (x) => x.k);
      const l = selectSignal(() => state().l);
      const zPlusK = selectSignal(z, k, (z, k) => z + k);
      const zWithL = selectSignal({ z, l });

      let xEmitted = 0;
      let yEmitted = 0;
      let zEmitted = 0;
      let zPlusKEmitted = 0;
      let zWithLEmitted = 0;

      effect(() => {
        x();
        xEmitted++;
      });

      effect(() => {
        y();
        yEmitted++;
      });

      effect(() => {
        z();
        zEmitted++;
      });

      effect(() => {
        zPlusK();
        zPlusKEmitted++;
      });

      effect(() => {
        zWithL();
        zWithLEmitted++;
      });

      expect(xEmitted).toBe(0);
      expect(yEmitted).toBe(0);
      expect(zEmitted).toBe(0);
      expect(zPlusKEmitted).toBe(0);
      expect(zWithLEmitted).toBe(0);

      tick();

      expect(xEmitted).toBe(1);
      expect(yEmitted).toBe(1);
      expect(zEmitted).toBe(1);
      expect(zPlusKEmitted).toBe(1);
      expect(zWithLEmitted).toBe(1);

      state.update((state) => ({ ...state, l: 10 }));
      tick();

      expect(xEmitted).toBe(1);
      expect(yEmitted).toBe(1);
      expect(zEmitted).toBe(1);
      expect(zPlusKEmitted).toBe(1);
      expect(zWithLEmitted).toBe(2);

      state.update((state) => ({ ...state, x: { ...state.x, k: 20 } }));
      tick();

      expect(xEmitted).toBe(2);
      expect(yEmitted).toBe(1);
      expect(zEmitted).toBe(1);
      expect(zPlusKEmitted).toBe(2);
      expect(zWithLEmitted).toBe(2);

      state.update((state) => ({ ...state, x: { ...state.x, y: { z: 1 } } }));
      tick();

      expect(xEmitted).toBe(3);
      expect(yEmitted).toBe(2);
      expect(zEmitted).toBe(1);
      expect(zPlusKEmitted).toBe(2);
      expect(zWithLEmitted).toBe(2);

      state.update((state) => ({ ...state, x: { ...state.x, y: { z: 10 } } }));
      tick();

      expect(xEmitted).toBe(4);
      expect(yEmitted).toBe(3);
      expect(zEmitted).toBe(2);
      expect(zPlusKEmitted).toBe(3);
      expect(zWithLEmitted).toBe(3);
    })
  );

  it(
    'uses custom equality function when provided',
    testEffects((tick) => {
      const state = signal([1, 2, 3]);
      const numbers = selectSignal(() => state(), {
        equal: (a, b) => a.length === b.length,
      });
      const first = selectSignal(state, (numbers) => numbers[0], {
        equal: (a: number, b: number) => Math.round(a) === Math.round(b),
      });

      let numbersEmitted = 0;
      let firstEmitted = 0;

      effect(() => {
        numbers();
        numbersEmitted++;
      });

      effect(() => {
        first();
        firstEmitted++;
      });

      expect(numbersEmitted).toBe(0);
      expect(firstEmitted).toBe(0);

      tick();

      expect(numbersEmitted).toBe(1);
      expect(firstEmitted).toBe(1);

      state.set([10, 20, 30]);
      tick();

      expect(numbersEmitted).toBe(1);
      expect(firstEmitted).toBe(2);

      state.set([10.1, 20.1, 30.1]);
      tick();

      expect(numbersEmitted).toBe(1);
      expect(firstEmitted).toBe(2);

      state.set([10.9, 20.9]);
      tick();

      expect(numbersEmitted).toBe(2);
      expect(firstEmitted).toBe(3);

      state.set([10.7, 20.7, 30.7]);
      tick();

      expect(numbersEmitted).toBe(3);
      expect(firstEmitted).toBe(3);
    })
  );
});
