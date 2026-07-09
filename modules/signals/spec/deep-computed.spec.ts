import { isSignal, signal } from '@angular/core';
import { deepComputed } from '../src';

describe('deepComputed', () => {
  it('creates a deep computed signal when computation result is an object literal', () => {
    const source = signal(0);
    const result = deepComputed(() => ({ count: { value: source() + 1 } }));

    expect(isSignal(result)).toBe(true);
    expect(isSignal(result.count)).toBe(true);
    expect(isSignal(result.count.value)).toBe(true);

    expect(result()).toEqual({ count: { value: 1 } });
    expect(result.count()).toEqual({ value: 1 });
    expect(result.count.value()).toBe(1);

    source.set(1);

    expect(result()).toEqual({ count: { value: 2 } });
    expect(result.count()).toEqual({ value: 2 });
    expect(result.count.value()).toBe(2);
  });

  it('creates a deep computed signal when computation result is a union of objects', () => {
    const source = signal<{ s: 'asdf' } | { m: { s: string } }>({
      m: { s: 't' },
    });
    const result = deepComputed(() => source());

    expect('m' in result).toBe(true);
    expect('m' in result && result.m()).toEqual({ s: 't' });
    expect('m' in result && result.m.s()).toBe('t');

    source.set({ s: 'asdf' });

    expect('m' in result).toBe(false);
    expect('s' in result).toBe(true);
    expect('s' in result && result.s()).toBe('asdf');

    source.set({ m: { s: 'ngrx' } });

    expect('s' in result).toBe(false);
    expect('m' in result).toBe(true);
    expect('m' in result && result.m()).toEqual({ s: 'ngrx' });
    expect('m' in result && result.m.s()).toBe('ngrx');
  });

  it('creates a deep computed signal when computation result is a union of nested objects', () => {
    const source = signal<{ a: { b: number } } | { c: { d: string } }>({
      a: { b: 1 },
    });
    const result = deepComputed(() => source());

    expect('a' in result).toBe(true);
    expect('a' in result && result.a()).toEqual({ b: 1 });
    expect('a' in result && result.a.b()).toBe(1);

    source.set({ c: { d: 't' } });

    expect('a' in result).toBe(false);
    expect('c' in result).toBe(true);
    expect('c' in result && result.c()).toEqual({ d: 't' });
    expect('c' in result && result.c.d()).toBe('t');
  });

  it('creates a deep computed signal when computation result is a union of an object, a primitive, and null', () => {
    const source = signal<{ m: { s: string } } | number | null>(null);
    const result = deepComputed(() => source());

    expect('m' in result).toBe(false);
    expect(result()).toBe(null);

    source.set(1);

    expect('m' in result).toBe(false);
    expect(result()).toBe(1);

    source.set({ m: { s: 'ngrx' } });

    expect('m' in result).toBe(true);
    expect('m' in result && result.m()).toEqual({ s: 'ngrx' });
    expect('m' in result && result.m.s()).toBe('ngrx');
  });

  it('does not create a deep computed signal when computation result is an array', () => {
    const source = signal(0);
    const result = deepComputed(() => [{ value: source() + 1 }]);

    expect(isSignal(result)).toBe(true);
    expect(result()).toEqual([{ value: 1 }]);
    expect((result as any)[0]).toBe(undefined);
  });

  it('does not create a deep computed signal when computation result is a primitive, null, or undefined', () => {
    const num = deepComputed(() => 1);
    const nul = deepComputed(() => null);
    const und = deepComputed(() => undefined);

    expect(isSignal(num)).toBe(true);
    expect(num()).toBe(1);

    expect(isSignal(nul)).toBe(true);
    expect(nul()).toBe(null);

    expect(isSignal(und)).toBe(true);
    expect(und()).toBe(undefined);
  });
});
