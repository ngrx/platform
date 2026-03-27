import { linkedSignal, type Signal, signal } from '@angular/core';
import {
  type DeepSignal,
  patchState,
  signalStore,
  withLinkedState,
  withMethods,
  withState,
} from '@ngrx/signals';
import { describe, expect, it } from 'tstyche';

describe('withLinkedState', () => {
  it('does not have access to methods', () => {
    signalStore(
      withMethods(() => ({
        foo: () => 'bar',
      })),
      // @ts-expect-error Property 'foo' does not exist on type '{}'
      withLinkedState(({ foo }) => ({ value: foo() }))
    );
  });

  it('does not have access to STATE_SOURCE', () => {
    signalStore(
      withState({ foo: 'bar' }),
      withLinkedState((store) => {
        patchState(
          // @ts-expect-error Argument of type '{ foo: Signal<string>; }' is not assignable to parameter of type 'WritableStateSource<object>'
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
        // @ts-expect-error Type 'string' is not assignable to type 'WritableSignal<unknown> | (() => unknown)'
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

    const userStore = new UserStore();

    expect(userStore.firstname).type.toBe<Signal<string>>();
    expect(userStore.lastname).type.toBe<Signal<string>>();
  });

  it('adds state slice with explicit linkedSignal', () => {
    const UserStore = signalStore(
      { providedIn: 'root' },
      withLinkedState(() => ({
        firstname: linkedSignal(() => 'John'),
        lastname: linkedSignal(() => 'Doe'),
      }))
    );

    const userStore = new UserStore();

    expect(userStore.firstname).type.toBe<Signal<string>>();
    expect(userStore.lastname).type.toBe<Signal<string>>();
  });

  it('creates deep signals with computation functions', () => {
    const UserStore = signalStore(
      { providedIn: 'root' },
      withLinkedState(() => ({
        user: () => ({ id: 1, name: 'John Doe' }),
        location: () => ({ city: 'Berlin', country: 'Germany' }),
      }))
    );

    const userStore = new UserStore();

    expect(userStore.location).type.toBe<
      DeepSignal<{ city: string; country: string }>
    >();
    expect(userStore.user).type.toBe<
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

    const userStore = new UserStore();

    expect(userStore.location).type.toBe<
      DeepSignal<{ city: string; country: string }>
    >();
    expect(userStore.user).type.toBe<
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

    const store = new Store();

    expect(store.bar).type.toBe<Signal<string>>();
    expect(store.baz).type.toBe<Signal<string>>();
    expect(store.qux).type.toBe<DeepSignal<{ x: number }>>();
  });
});
