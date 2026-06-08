import { expectTypeOf } from 'vitest';
import { signal, Signal, WritableSignal } from '@angular/core';
import {
  deepComputed,
  DeepSignal,
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';

describe('withComputed', () => {
  it('has access to props, state signals and methods', () => {
    signalStore(
      withState({ a: 1 }),
      withProps(() => ({ b: 2 })),
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
      withState({ a: 1 }),
      withComputed((store) => ({
        prettySum: () => {
          // @ts-expect-error - store is not assignable to parameter of type 'WritableStateSource<object>'
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

    type S = InstanceType<typeof Store>;
    expectTypeOf<S['user']>().toEqualTypeOf<
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

    type S = InstanceType<typeof Store>;
    expectTypeOf<S['user']>().toEqualTypeOf<
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

    type S = InstanceType<typeof Store>;
    expectTypeOf<S['user']>().toEqualTypeOf<
      DeepSignal<{ name: string; address: { street: string; city: string } }>
    >();
  });
});
