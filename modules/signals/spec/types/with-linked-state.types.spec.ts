import { expectTypeOf } from 'vitest';
import { linkedSignal, Signal, signal } from '@angular/core';
import {
  DeepSignal,
  patchState,
  signalStore,
  withLinkedState,
  withMethods,
  withState,
} from '@ngrx/signals';

describe('withLinkedState', () => {
  it('does not have access to methods', () => {
    signalStore(
      withMethods(() => ({
        foo: () => 'bar',
      })),
      withLinkedState(
        // @ts-expect-error - Property 'foo' does not exist on type '{}'
        ({ foo }: { foo: unknown }) => ({ value: foo })
      )
    );
  });

  it('does not have access to STATE_SOURCE', () => {
    signalStore(
      withState({ foo: 'bar' }),
      withLinkedState((store) => {
        patchState(
          // @ts-expect-error - store is not assignable to parameter of type 'WritableStateSource<object>'
          store,
          { foo: 'baz' }
        );
        return { bar: () => 'baz' };
      })
    );
  });

  it('cannot return a primitive value', () => {
    signalStore(
      withLinkedState(() => ({
        // @ts-expect-error - Type 'string' is not assignable to type 'WritableSignal<unknown> | (() => unknown)'
        foo: 'bar',
      }))
    );
  });

  it('adds state slice with computation function', () => {
    const UserStore = signalStore(
      { providedIn: 'root' },
      withLinkedState(() => ({
        firstname: () => 'John',
        lastname: () => 'Doe',
      }))
    );

    type S = InstanceType<typeof UserStore>;
    expectTypeOf<S['firstname']>().toEqualTypeOf<Signal<string>>();
    expectTypeOf<S['lastname']>().toEqualTypeOf<Signal<string>>();
  });

  it('adds state slice with explicit linkedSignal', () => {
    const UserStore = signalStore(
      { providedIn: 'root' },
      withLinkedState(() => ({
        firstname: linkedSignal(() => 'John'),
        lastname: linkedSignal(() => 'Doe'),
      }))
    );

    type S = InstanceType<typeof UserStore>;
    expectTypeOf<S['firstname']>().toEqualTypeOf<Signal<string>>();
    expectTypeOf<S['lastname']>().toEqualTypeOf<Signal<string>>();
  });

  it('creates deep signals with computation functions', () => {
    const UserStore = signalStore(
      { providedIn: 'root' },
      withLinkedState(() => ({
        user: () => ({ id: 1, name: 'John Doe' }),
        location: () => ({ city: 'Berlin', country: 'Germany' }),
      }))
    );

    type S = InstanceType<typeof UserStore>;
    expectTypeOf<S['location']>().toEqualTypeOf<
      DeepSignal<{ city: string; country: string }>
    >();
    expectTypeOf<S['user']>().toEqualTypeOf<
      DeepSignal<{ id: number; name: string }>
    >();
  });

  it('creates deep signals with explicit linked signals', () => {
    const UserStore = signalStore(
      { providedIn: 'root' },
      withLinkedState(() => ({
        user: linkedSignal(() => ({ id: 1, name: 'John Doe' })),
        location: linkedSignal(() => ({ city: 'Berlin', country: 'Germany' })),
      }))
    );

    type S = InstanceType<typeof UserStore>;
    expectTypeOf<S['location']>().toEqualTypeOf<
      DeepSignal<{ city: string; country: string }>
    >();
    expectTypeOf<S['user']>().toEqualTypeOf<
      DeepSignal<{ id: number; name: string }>
    >();
  });

  it('infers the types for a mixed setting', () => {
    const Store = signalStore(
      withState({ foo: 'bar' }),
      withLinkedState(({ foo }) => ({
        bar: () => foo(),
        baz: linkedSignal(() => foo()),
        qux: signal({ x: 1 }),
      }))
    );

    type S = InstanceType<typeof Store>;
    expectTypeOf<S['bar']>().toEqualTypeOf<Signal<string>>();
    expectTypeOf<S['baz']>().toEqualTypeOf<Signal<string>>();
    expectTypeOf<S['qux']>().toEqualTypeOf<DeepSignal<{ x: number }>>();
  });
});
