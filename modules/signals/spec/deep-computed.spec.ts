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

  it('does not create a deep computed signal when computation result is an array', () => {
    const source = signal(0);
    const result = deepComputed(() => [{ value: source() + 1 }]);

    expect(isSignal(result)).toBe(true);
    expect(result()).toEqual([{ value: 1 }]);
    expect((result as any)[0]).toBe(undefined);
  });
});
