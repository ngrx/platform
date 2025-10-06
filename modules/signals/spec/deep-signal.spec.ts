import { isSignal, signal } from '@angular/core';
import { toDeepSignal } from '../src/deep-signal';

describe('toDeepSignal', () => {
  it('creates deep signals for plain objects', () => {
    const sig = signal({ m: { s: 't' } });
    const deepSig = toDeepSignal(sig);

    expect(sig).not.toBe(deepSig);

    expect(isSignal(deepSig)).toBe(true);
    expect(deepSig()).toEqual({ m: { s: 't' } });

    expect(isSignal(deepSig.m)).toBe(true);
    expect(deepSig.m()).toEqual({ s: 't' });

    expect(isSignal(deepSig.m.s)).toBe(true);
    expect(deepSig.m.s()).toBe('t');
  });

  it('creates deep signals for custom class instances', () => {
    class User {
      constructor(readonly firstName: string) {}
    }

    class UserState {
      constructor(readonly user: User) {}
    }

    const sig = signal(new UserState(new User('John')));
    const deepSig = toDeepSignal(sig);

    expect(sig).not.toBe(deepSig);

    expect(isSignal(deepSig)).toBe(true);
    expect(deepSig()).toEqual({ user: { firstName: 'John' } });

    expect(isSignal(deepSig.user)).toBe(true);
    expect(deepSig.user()).toEqual({ firstName: 'John' });

    expect(isSignal(deepSig.user.firstName)).toBe(true);
    expect(deepSig.user.firstName()).toBe('John');
  });

  it('allows lazy initialization', () => {
    const sig = signal(undefined as unknown as { m: { s: 't' } });
    const deepSig = toDeepSignal(sig);

    sig.set({ m: { s: 't' } });

    expect(deepSig()).toEqual({ m: { s: 't' } });
    expect(deepSig.m()).toEqual({ s: 't' });
    expect(deepSig.m.s()).toBe('t');
  });

  it('creates a deep signal when value is a union of objects', () => {
    const sig = signal({ m: { s: 't' } } as
      | { s: 'asdf' }
      | { m: { s: string } });
    const deepSig = toDeepSignal(sig);

    expect('m' in deepSig).toBe(true);
    expect('m' in deepSig && deepSig.m()).toEqual({ s: 't' });
    expect('m' in deepSig && deepSig.m.s()).toBe('t');

    sig.set({ s: 'asdf' });

    expect('m' in deepSig).toBe(false);
    expect('s' in deepSig).toBe(true);
    expect('s' in deepSig && deepSig.s()).toBe('asdf');

    sig.set({ m: { s: 'ngrx' } });

    expect('s' in deepSig).toBe(false);
    expect('m' in deepSig).toBe(true);
    expect('m' in deepSig && deepSig.m()).toEqual({ s: 'ngrx' });
    expect('m' in deepSig && deepSig.m.s()).toBe('ngrx');
  });

  it('does not affect signals with primitives as values', () => {
    const num = signal(0);
    const str = signal('str');
    const bool = signal(true);

    const deepNum = toDeepSignal(num);
    const deepStr = toDeepSignal(str);
    const deepBool = toDeepSignal(bool);

    expect(isSignal(deepNum)).toBe(true);
    expect(deepNum()).toBe(num());

    expect(isSignal(deepStr)).toBe(true);
    expect(deepStr()).toBe(str());

    expect(isSignal(deepBool)).toBe(true);
    expect(deepBool()).toBe(bool());
  });

  it('does not affect signals with iterables as values', () => {
    const array = signal([]);
    const set = signal(new Set());
    const map = signal(new Map());
    const uintArray = signal(new Uint32Array());
    const floatArray = signal(new Float64Array());

    const deepArray = toDeepSignal(array);
    const deepSet = toDeepSignal(set);
    const deepMap = toDeepSignal(map);
    const deepUintArray = toDeepSignal(uintArray);
    const deepFloatArray = toDeepSignal(floatArray);

    expect(isSignal(deepArray)).toBe(true);
    expect(deepArray()).toBe(array());

    expect(isSignal(deepSet)).toBe(true);
    expect(deepSet()).toBe(set());

    expect(isSignal(deepMap)).toBe(true);
    expect(deepMap()).toBe(map());

    expect(isSignal(deepUintArray)).toBe(true);
    expect(deepUintArray()).toBe(uintArray());

    expect(isSignal(deepFloatArray)).toBe(true);
    expect(deepFloatArray()).toBe(floatArray());
  });

  it('does not affect signals with built-in object types as values', () => {
    const weakSet = signal(new WeakSet());
    const weakMap = signal(new WeakMap());
    const promise = signal(Promise.resolve(10));
    const date = signal(new Date());
    const error = signal(new Error());
    const regExp = signal(new RegExp(''));
    const arrayBuffer = signal(new ArrayBuffer(10));
    const dataView = signal(new DataView(new ArrayBuffer(10)));

    const deepWeakSet = toDeepSignal(weakSet);
    const deepWeakMap = toDeepSignal(weakMap);
    const deepPromise = toDeepSignal(promise);
    const deepDate = toDeepSignal(date);
    const deepError = toDeepSignal(error);
    const deepRegExp = toDeepSignal(regExp);
    const deepArrayBuffer = toDeepSignal(arrayBuffer);
    const deepDataView = toDeepSignal(dataView);

    expect(isSignal(deepWeakSet)).toBe(true);
    expect(deepWeakSet()).toBe(weakSet());

    expect(isSignal(deepWeakMap)).toBe(true);
    expect(deepWeakMap()).toBe(weakMap());

    expect(isSignal(deepPromise)).toBe(true);
    expect(deepPromise()).toBe(promise());

    expect(isSignal(deepDate)).toBe(true);
    expect(deepDate()).toBe(date());

    expect(isSignal(deepError)).toBe(true);
    expect(deepError()).toBe(error());

    expect(isSignal(deepRegExp)).toBe(true);
    expect(deepRegExp()).toBe(regExp());

    expect(isSignal(deepArrayBuffer)).toBe(true);
    expect(deepArrayBuffer()).toBe(arrayBuffer());

    expect(isSignal(deepDataView)).toBe(true);
    expect(deepDataView()).toBe(dataView());
  });

  it('does not affect signals with functions as values', () => {
    const fn1 = signal(new Function());
    const fn2 = signal(function () {});
    const fn3 = signal(() => {});

    const deepFn1 = toDeepSignal(fn1);
    const deepFn2 = toDeepSignal(fn2);
    const deepFn3 = toDeepSignal(fn3);

    expect(isSignal(deepFn1)).toBe(true);
    expect(deepFn1()).toBe(fn1());

    expect(isSignal(deepFn2)).toBe(true);
    expect(deepFn2()).toBe(fn2());

    expect(isSignal(deepFn3)).toBe(true);
    expect(deepFn3()).toBe(fn3());
  });

  it('does not affect signals with custom class instances that are iterables as values', () => {
    class CustomArray extends Array {}

    class CustomSet extends Set {}

    class CustomFloatArray extends Float32Array {}

    const array = signal(new CustomArray());
    const floatArray = signal(new CustomFloatArray());
    const set = signal(new CustomSet());

    const deepArray = toDeepSignal(array);
    const deepFloatArray = toDeepSignal(floatArray);
    const deepSet = toDeepSignal(set);

    expect(isSignal(deepArray)).toBe(true);
    expect(deepArray()).toBe(array());

    expect(isSignal(deepFloatArray)).toBe(true);
    expect(deepFloatArray()).toBe(floatArray());

    expect(isSignal(deepSet)).toBe(true);
    expect(deepSet()).toBe(set());
  });

  it('does not affect signals with custom class instances that extend built-in object types as values', () => {
    class CustomWeakMap extends WeakMap {}

    class CustomError extends Error {}

    class CustomArrayBuffer extends ArrayBuffer {}

    const weakMap = signal(new CustomWeakMap());
    const error = signal(new CustomError());
    const arrayBuffer = signal(new CustomArrayBuffer(10));

    const deepWeakMap = toDeepSignal(weakMap);
    const deepError = toDeepSignal(error);
    const deepArrayBuffer = toDeepSignal(arrayBuffer);

    expect(isSignal(deepWeakMap)).toBe(true);
    expect(deepWeakMap()).toBe(weakMap());

    expect(isSignal(deepError)).toBe(true);
    expect(deepError()).toBe(error());

    expect(isSignal(deepArrayBuffer)).toBe(true);
    expect(deepArrayBuffer()).toBe(arrayBuffer());
  });
});
