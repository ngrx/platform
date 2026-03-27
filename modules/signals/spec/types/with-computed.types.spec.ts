import {
  deepComputed,
  type DeepSignal,
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { TestBed } from '@angular/core/testing';
import { signal, type Signal, type WritableSignal } from '@angular/core';
import { describe, expect, it } from 'tstyche';

describe('withComputed', () => {
  it('has access to props, state signals and methods', () => {
    signalStore(
      withState({
        a: 1,
      }),
      withProps(() => {
        return {
          b: 2,
        };
      }),
      withMethods(({ a, b }) => ({
        sum: () => a() + b,
      })),
      withComputed(({ a, b, sum }) => ({
        prettySum: () => `Sum: ${a()} + ${b} = ${sum()}`,
      }))
    );
  });

  it('has no access to the state source', () => {
    signalStore(
      withState({
        a: 1,
      }),
      withComputed((store) => ({
        prettySum: () => {
          // @ts-expect-error Argument of type '{ a: Signal<number>; }' is not assignable to parameter of type 'WritableStateSource<object>'
          patchState(store, { a: 2 });
          return store.a();
        },
      }))
    );
  });

  it('creates a Signal automatically', () => {
    const Store = signalStore(
      withComputed(() => ({
        user: () => ({ firstName: 'John', lastName: 'Doe' }),
      }))
    );

    const store = TestBed.inject(Store);

    expect(store.user).type.toBe<
      Signal<{ firstName: string; lastName: string }>
    >();
  });

  it('keeps a WritableSignal intact, if passed', () => {
    const user = signal({ firstName: 'John', lastName: 'Doe' });

    const Store = signalStore(
      withComputed(() => ({
        user,
      }))
    );

    const store = TestBed.inject(Store);

    expect(store.user).type.toBe<
      WritableSignal<{ firstName: string; lastName: string }>
    >();
  });

  it('keeps a DeepSignal intact, if passed', () => {
    const user = deepComputed(
      signal({
        name: 'John Doe',
        address: {
          street: '123 Main St',
          city: 'Anytown',
        },
      })
    );

    const Store = signalStore(
      withComputed(() => ({
        user,
      }))
    );

    const store = TestBed.inject(Store);

    expect(store.user).type.toBe<
      DeepSignal<{ name: string; address: { street: string; city: string } }>
    >();
  });
});
