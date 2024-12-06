import { toDeepSignal } from '../src/deep-signal';
import { isSignal, signal } from '@angular/core';

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

  it('does not create deep signals for primitives', () => {
    const num = signal(0);
    const str = signal('str');
    const bool = signal(true);

    const deepNum = toDeepSignal(num);
    const deepStr = toDeepSignal(str);
    const deepBool = toDeepSignal(bool);

    expect(deepNum).toBe(num);
    expect(deepStr).toBe(str);
    expect(deepBool).toBe(bool);
  });

  it('does not create deep signals for built-in object types', () => {
    const array = signal([]);
    const set = signal(new Set());
    const map = signal(new Map());
    const date = signal(new Date());
    const error = signal(new Error());
    const regExp = signal(new RegExp(''));

    const deepArray = toDeepSignal(array);
    const deepSet = toDeepSignal(set);
    const deepMap = toDeepSignal(map);
    const deepDate = toDeepSignal(date);
    const deepError = toDeepSignal(error);
    const deepRegExp = toDeepSignal(regExp);

    expect(deepArray).toBe(array);
    expect(deepSet).toBe(set);
    expect(deepMap).toBe(map);
    expect(deepDate).toBe(date);
    expect(deepError).toBe(error);
    expect(deepRegExp).toBe(regExp);
  });

  it('does not create deep signals for functions', () => {
    const fn1 = signal(new Function());
    const fn2 = signal(function () {});
    const fn3 = signal(() => {});

    const deepFn1 = toDeepSignal(fn1);
    const deepFn2 = toDeepSignal(fn2);
    const deepFn3 = toDeepSignal(fn3);

    expect(deepFn1).toBe(fn1);
    expect(deepFn2).toBe(fn2);
    expect(deepFn3).toBe(fn3);
  });

  it('does not create deep signals for custom class instances that extend built-in object types', () => {
    class CustomArray extends Array {}
    class CustomSet extends Set {}
    class CustomError extends Error {}

    const array = signal(new CustomArray());
    const set = signal(new CustomSet());
    const error = signal(new CustomError());

    const deepArray = toDeepSignal(array);
    const deepSet = toDeepSignal(set);
    const deepError = toDeepSignal(error);

    expect(deepArray).toBe(array);
    expect(deepSet).toBe(set);
    expect(deepError).toBe(error);
  });
});
