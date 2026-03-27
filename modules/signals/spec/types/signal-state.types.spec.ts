import type { Signal } from '@angular/core';
import {
  type DeepSignal,
  patchState,
  signalState,
  type SignalState,
} from '@ngrx/signals';
import { describe, expect, it } from 'tstyche';

const initialState = {
  user: {
    age: 30,
    details: {
      first: 'John',
      last: 'Smith',
    },
    address: ['Belgrade', 'Serbia'],
  },
  numbers: [1, 2, 3],
  ngrx: 'rocks',
};

describe('signalState', () => {
  it('allows passing state as a generic argument', () => {
    type FooState = { foo: string; bar: number };
    const state = signalState<FooState>({ foo: 'bar', bar: 1 });

    expect(state).type.toBe<SignalState<FooState>>();
  });

  it('creates deep signals for nested state slices', () => {
    const state = signalState(initialState);

    expect(state).type.toBe<
      SignalState<{
        user: {
          age: number;
          details: { first: string; last: string };
          address: string[];
        };
        numbers: number[];
        ngrx: string;
      }>
    >();
    expect(state.user).type.toBe<
      DeepSignal<{
        age: number;
        details: { first: string; last: string };
        address: string[];
      }>
    >();
    expect(state.user.age).type.toBe<Signal<number>>();
    expect(state.user.details).type.toBe<
      DeepSignal<{ first: string; last: string }>
    >();
    expect(state.user.details.first).type.toBe<Signal<string>>();
    expect(state.user.details.last).type.toBe<Signal<string>>();
    expect(state.user.address).type.toBe<Signal<string[]>>();
    expect(state.numbers).type.toBe<Signal<number[]>>();
    expect(state.ngrx).type.toBe<Signal<string>>();
  });

  it('creates deep signals when state type is an interface', () => {
    interface User {
      firstName: string;
      lastName: string;
    }

    interface State {
      user: User;
      bool: boolean;
      map: Map<string, string>;
      set: Set<{ foo: number }>;
    }

    const state = signalState<State>({
      user: { firstName: 'John', lastName: 'Smith' },
      bool: true,
      map: new Map<string, string>(),
      set: new Set<{ foo: number }>(),
    });

    expect(state.user).type.toBe<DeepSignal<User>>();
    expect(state.user.lastName).type.toBe<Signal<string>>();
    expect(state.bool).type.toBe<Signal<boolean>>();
    expect(state.map).type.toBe<Signal<Map<string, string>>>();
    expect(state.set).type.toBe<Signal<Set<{ foo: number }>>>();
  });

  it('does not create deep signals for iterables', () => {
    const arrayState = signalState<string[]>([]);
    const arrayStateValue = arrayState();

    const setState = signalState(new Set<number>());
    const setStateValue = setState();

    const mapState = signalState(new Map<number, { bar: boolean }>());
    const mapStateValue = mapState();

    const uintArrayState = signalState(new Uint8ClampedArray());
    const uintArrayStateValue = uintArrayState();

    expect(arrayStateValue).type.toBe<string[]>();
    expect<
      Extract<keyof typeof arrayState, string | number>
    >().type.toBe<never>();
    expect(setStateValue).type.toBe<Set<number>>();
    expect<
      Extract<keyof typeof setState, string | number>
    >().type.toBe<never>();
    expect(mapStateValue).type.toBe<Map<number, { bar: boolean }>>();
    expect<
      Extract<keyof typeof mapState, string | number>
    >().type.toBe<never>();
    expect(uintArrayStateValue).type.toBe<Uint8ClampedArray<ArrayBuffer>>();
    expect<
      Extract<keyof typeof uintArrayState, string | number>
    >().type.toBe<never>();
  });

  it('does not create deep signals for built-in object types', () => {
    const weakSetState = signalState(new WeakSet<{ foo: string }>());
    const weakSetStateValue = weakSetState();

    const dateState = signalState(new Date());
    const dateStateValue = dateState();

    const errorState = signalState(new Error());
    const errorStateValue = errorState();

    const regExpState = signalState(new RegExp(''));
    const regExpStateValue = regExpState();

    expect(weakSetStateValue).type.toBe<WeakSet<{ foo: string }>>();
    expect<
      Extract<keyof typeof weakSetState, string | number>
    >().type.toBe<never>();
    expect(dateStateValue).type.toBe<Date>();
    expect<
      Extract<keyof typeof dateState, string | number>
    >().type.toBe<never>();
    expect(errorStateValue).type.toBe<Error>();
    expect<
      Extract<keyof typeof errorState, string | number>
    >().type.toBe<never>();
    expect(regExpStateValue).type.toBe<RegExp>();
    expect<
      Extract<keyof typeof regExpState, string | number>
    >().type.toBe<never>();
  });

  it('does not create deep signals for functions', () => {
    const state = signalState(() => {});
    const stateValue = state();

    expect(stateValue).type.toBe<() => void>();
    expect<Extract<keyof typeof state, string | number>>().type.toBe<never>();
  });

  it('does not create deep signals for optional state slices', () => {
    type State = {
      foo?: string;
      bar: { baz?: number };
      x?: { y: { z?: boolean } };
    };

    const state = signalState<State>({ bar: {} });

    expect(state).type.toBe<SignalState<State>>();
    expect(state.foo).type.toBe<Signal<string | undefined> | undefined>();
    expect(state.bar).type.toBe<DeepSignal<{ baz?: number }>>();
    expect(state.bar.baz).type.toBe<Signal<number | undefined> | undefined>();
    expect(state.x).type.toBe<
      Signal<{ y: { z?: boolean } } | undefined> | undefined
    >();
  });

  it('does not create deep signals for unknown records', () => {
    const state1 = signalState<{ [key: string]: number }>({});
    const state2 = signalState<{ [key: number]: { foo: string } }>({
      1: { foo: 'bar' },
    });
    const state3 = signalState<Record<string, { bar: number }>>({});
    const state4 = signalState({
      foo: {} as Record<string, { bar: boolean } | number>,
    });
    const state5 = signalState({
      bar: { baz: {} as Record<number, unknown> },
    });
    const state6 = signalState({
      x: {} as Record<symbol, string>,
    });
    const state7 = signalState({ y: {} });

    expect(state1).type.toBe<SignalState<{ [key: string]: number }>>();
    expect<Extract<keyof typeof state1, string | number>>().type.toBe<never>();
    expect(state2).type.toBe<SignalState<{ [key: number]: { foo: string } }>>();
    expect<Extract<keyof typeof state2, string | number>>().type.toBe<never>();
    expect(state3).type.toBe<SignalState<Record<string, { bar: number }>>>();
    expect<Extract<keyof typeof state3, string | number>>().type.toBe<never>();
    expect(state4).type.toBe<
      SignalState<{ foo: Record<string, number | { bar: boolean }> }>
    >();
    expect(state4.foo).type.toBe<
      Signal<Record<string, number | { bar: boolean }>>
    >();
    expect(state5).type.toBe<
      SignalState<{ bar: { baz: Record<number, unknown> } }>
    >();
    expect(state5.bar).type.toBe<
      DeepSignal<{ baz: Record<number, unknown> }>
    >();
    expect(state5.bar.baz).type.toBe<Signal<Record<number, unknown>>>();
    expect(state6).type.toBe<SignalState<{ x: Record<symbol, string> }>>();
    expect(state6.x).type.toBe<Signal<Record<symbol, string>>>();
    expect(state7).type.toBe<SignalState<{ y: {} }>>();
    expect(state7.y).type.toBe<Signal<{}>>();
  });

  it('succeeds when state is an empty object', () => {
    const state = signalState({});
    expect(state).type.toBe<SignalState<{}>>();
  });

  it('succeeds when state slices are union types', () => {
    type State = {
      foo: { s: string } | number;
      bar: { baz: { n: number } | null };
      x: { y: { z: boolean | undefined } };
    };

    const state = signalState<State>({
      foo: { s: 's' },
      bar: { baz: null },
      x: { y: { z: undefined } },
    });

    expect(state).type.toBe<SignalState<State>>();
    expect(state.foo).type.toBe<Signal<number | { s: string }>>();
    expect(state.bar).type.toBe<DeepSignal<{ baz: { n: number } | null }>>();
    expect(state.bar.baz).type.toBe<Signal<{ n: number } | null>>();
    expect(state.x).type.toBe<DeepSignal<{ y: { z: boolean | undefined } }>>();
    expect(state.x.y).type.toBe<DeepSignal<{ z: boolean | undefined }>>();
    expect(state.x.y.z).type.toBe<Signal<boolean | undefined>>();
  });

  it('succeeds when state contains Function properties', () => {
    const state1 = signalState({ name: 0 });
    const state2 = signalState({ foo: { length: [] as boolean[] } });
    const state3 = signalState({ name: { length: '' } });

    expect(state1.name).type.toBe<Signal<number>>();
    expect(state2.foo.length).type.toBe<Signal<boolean[]>>();
    expect(state3.name).type.toBe<DeepSignal<{ length: string }>>();
    expect(state3.name.length).type.toBe<Signal<string>>();
  });

  it('fails when state is not an object', () => {
    expect(signalState).type.not.toBeCallableWith(10);
    expect(signalState).type.not.toBeCallableWith('');
    expect(signalState).type.not.toBeCallableWith(null);
    expect(signalState).type.not.toBeCallableWith(true);
  });

  it('patches state via sequence of partial state objects and updater functions', () => {
    const state = signalState(initialState);

    patchState(
      state,
      { numbers: [10, 100, 1000] },
      (state) => ({ user: { ...state.user, age: state.user.age + 1 } }),
      { ngrx: 'signals' }
    );
  });

  it('fails when state is patched with a non-record', () => {
    const state = signalState(initialState);
    expect(patchState).type.not.toBeCallableWith(state, 10);
    expect(patchState).type.not.toBeCallableWith(state, undefined);
    expect(patchState).type.not.toBeCallableWith(state, [1, 2, 3]);
  });

  it('fails when state is patched with a wrong record', () => {
    const state = signalState(initialState);
    expect(patchState).type.not.toBeCallableWith(state, { ngrx: 10 });
  });

  it('fails when state is patched with a wrong updater function', () => {
    const state = signalState(initialState);
    expect(patchState).type.not.toBeCallableWith(state, () => ({
      user: { ...state.user, age: '30' },
    }));
  });
});
