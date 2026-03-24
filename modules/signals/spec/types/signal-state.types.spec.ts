import { expectTypeOf } from 'vitest';
import { Signal } from '@angular/core';
import {
  DeepSignal,
  patchState,
  signalState,
  SignalState,
} from '@ngrx/signals';

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

    expectTypeOf(state).toEqualTypeOf<SignalState<FooState>>();
  });

  it('creates deep signals for nested state slices', () => {
    const state = signalState(initialState);

    const user = state.user;
    const age = state.user.age;
    const details = state.user.details;
    const first = state.user.details.first;
    const last = state.user.details.last;
    const address = state.user.address;
    const numbers = state.numbers;
    const ngrx = state.ngrx;

    expectTypeOf(state).toEqualTypeOf<
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
    expectTypeOf(user).toEqualTypeOf<
      DeepSignal<{
        age: number;
        details: { first: string; last: string };
        address: string[];
      }>
    >();
    expectTypeOf(details).toEqualTypeOf<
      DeepSignal<{ first: string; last: string }>
    >();
    expectTypeOf(age).toEqualTypeOf<Signal<number>>();
    expectTypeOf(first).toEqualTypeOf<Signal<string>>();
    expectTypeOf(last).toEqualTypeOf<Signal<string>>();
    expectTypeOf(address).toEqualTypeOf<Signal<string[]>>();
    expectTypeOf(numbers).toEqualTypeOf<Signal<number[]>>();
    expectTypeOf(ngrx).toEqualTypeOf<Signal<string>>();
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

    const user = state.user;
    const lastName = state.user.lastName;
    const bool = state.bool;
    const map = state.map;
    const set = state.set;

    expectTypeOf(user).toEqualTypeOf<DeepSignal<User>>();
    expectTypeOf(lastName).toEqualTypeOf<Signal<string>>();
    expectTypeOf(bool).toEqualTypeOf<Signal<boolean>>();
    expectTypeOf(map).toEqualTypeOf<Signal<Map<string, string>>>();
    expectTypeOf(set).toEqualTypeOf<Signal<Set<{ foo: number }>>>();
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

    expectTypeOf(arrayStateValue).toEqualTypeOf<string[]>();
    expectTypeOf<string & keyof typeof arrayState>().toBeNever();

    expectTypeOf(setStateValue).toEqualTypeOf<Set<number>>();
    expectTypeOf<string & keyof typeof setState>().toBeNever();

    expectTypeOf(mapStateValue).toEqualTypeOf<Map<number, { bar: boolean }>>();
    expectTypeOf<string & keyof typeof mapState>().toBeNever();

    expectTypeOf(uintArrayStateValue).toEqualTypeOf<Uint8ClampedArray>();
    expectTypeOf<string & keyof typeof uintArrayState>().toBeNever();
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

    expectTypeOf(weakSetStateValue).toEqualTypeOf<WeakSet<{ foo: string }>>();
    expectTypeOf<string & keyof typeof weakSetState>().toBeNever();

    expectTypeOf(dateStateValue).toEqualTypeOf<Date>();
    expectTypeOf<string & keyof typeof dateState>().toBeNever();

    expectTypeOf(errorStateValue).toEqualTypeOf<Error>();
    expectTypeOf<string & keyof typeof errorState>().toBeNever();

    expectTypeOf(regExpStateValue).toEqualTypeOf<RegExp>();
    expectTypeOf<string & keyof typeof regExpState>().toBeNever();
  });

  it('does not create deep signals for functions', () => {
    const state = signalState(() => {});
    const stateValue = state();

    expectTypeOf(stateValue).toEqualTypeOf<() => void>();
    expectTypeOf<string & keyof typeof state>().toBeNever();
  });

  it('does not create deep signals for optional state slices', () => {
    type State = {
      foo?: string;
      bar: { baz?: number };
      x?: { y: { z?: boolean } };
    };

    const state = signalState<State>({ bar: {} });
    const foo = state.foo;
    const bar = state.bar;
    const baz = state.bar.baz;
    const x = state.x;

    expectTypeOf(state).toEqualTypeOf<SignalState<State>>();
    expectTypeOf(foo).toEqualTypeOf<Signal<string | undefined> | undefined>();
    expectTypeOf(bar).toEqualTypeOf<DeepSignal<{ baz?: number | undefined }>>();
    expectTypeOf(baz).toEqualTypeOf<Signal<number | undefined> | undefined>();
    expectTypeOf(x).toEqualTypeOf<
      Signal<{ y: { z?: boolean | undefined } } | undefined> | undefined
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
    const foo = state4.foo;
    const state5 = signalState({
      bar: { baz: {} as Record<number, unknown> },
    });
    const bar = state5.bar;
    const baz = bar.baz;
    const state6 = signalState({
      x: {} as Record<symbol, string>,
    });
    const x = state6.x;
    const state7 = signalState({ y: {} });
    const y = state7.y;

    expectTypeOf(state1).toEqualTypeOf<
      SignalState<{ [key: string]: number }>
    >();
    expectTypeOf<string & keyof typeof state1>().toBeNever();

    expectTypeOf(state2).toEqualTypeOf<
      SignalState<{ [key: number]: { foo: string } }>
    >();
    expectTypeOf<string & keyof typeof state2>().toBeNever();

    expectTypeOf(state3).toEqualTypeOf<
      SignalState<Record<string, { bar: number }>>
    >();
    expectTypeOf<string & keyof typeof state3>().toBeNever();

    expectTypeOf(state4).toEqualTypeOf<
      SignalState<{ foo: Record<string, number | { bar: boolean }> }>
    >();
    expectTypeOf(foo).toEqualTypeOf<
      Signal<Record<string, number | { bar: boolean }>>
    >();

    expectTypeOf(state5).toEqualTypeOf<
      SignalState<{ bar: { baz: Record<number, unknown> } }>
    >();
    expectTypeOf(bar).toEqualTypeOf<
      DeepSignal<{ baz: Record<number, unknown> }>
    >();
    expectTypeOf(baz).toEqualTypeOf<Signal<Record<number, unknown>>>();

    expectTypeOf(state6).toEqualTypeOf<
      SignalState<{ x: Record<symbol, string> }>
    >();
    expectTypeOf(x).toEqualTypeOf<Signal<Record<symbol, string>>>();

    expectTypeOf(state7).toEqualTypeOf<SignalState<{ y: {} }>>();
    expectTypeOf(y).toEqualTypeOf<Signal<{}>>();
  });

  it('succeeds when state is an empty object', () => {
    const state = signalState({});
    expectTypeOf(state).toEqualTypeOf<SignalState<{}>>();
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
    const foo = state.foo;
    const bar = state.bar;
    const baz = state.bar.baz;
    const x = state.x;
    const y = state.x.y;
    const z = state.x.y.z;

    expectTypeOf(state).toEqualTypeOf<SignalState<State>>();
    expectTypeOf(foo).toEqualTypeOf<Signal<number | { s: string }>>();
    expectTypeOf(bar).toEqualTypeOf<
      DeepSignal<{ baz: { n: number } | null }>
    >();
    expectTypeOf(baz).toEqualTypeOf<Signal<{ n: number } | null>>();
    expectTypeOf(x).toEqualTypeOf<
      DeepSignal<{ y: { z: boolean | undefined } }>
    >();
    expectTypeOf(y).toEqualTypeOf<DeepSignal<{ z: boolean | undefined }>>();
    expectTypeOf(z).toEqualTypeOf<Signal<boolean | undefined>>();
  });

  it('succeeds when state contains Function properties', () => {
    const state1 = signalState({ name: 0 });
    const state2 = signalState({ foo: { length: [] as boolean[] } });
    const state3 = signalState({ name: { length: '' } });

    const name = state1.name;
    const length1 = state2.foo.length;
    const name2 = state3.name;
    const length2 = state3.name.length;

    expectTypeOf(name).toEqualTypeOf<Signal<number>>();
    expectTypeOf(length1).toEqualTypeOf<Signal<boolean[]>>();
    expectTypeOf(name2).toEqualTypeOf<DeepSignal<{ length: string }>>();
    expectTypeOf(length2).toEqualTypeOf<Signal<string>>();
  });

  it('fails when state is not an object', () => {
    void (() => {
      // @ts-expect-error
      signalState(10);
      // @ts-expect-error
      signalState('');
      // @ts-expect-error
      signalState(null);
      // @ts-expect-error
      signalState(true);
    });
  });

  it('patches state via sequence of partial state objects and updater functions', () => {
    const state = signalState(initialState);

    patchState(
      state,
      { numbers: [10, 100, 1000] },
      (s) => ({ user: { ...s.user, age: s.user.age + 1 } }),
      { ngrx: 'signals' }
    );
  });

  it('fails when state is patched with a non-record', () => {
    const state = signalState(initialState);
    // @ts-expect-error
    patchState(state, 10);

    const state2 = signalState(initialState);
    // @ts-expect-error
    patchState(state2, undefined);

    const state3 = signalState(initialState);
    // @ts-expect-error
    patchState(state3, [1, 2, 3]);
  });

  it('fails when state is patched with a wrong record', () => {
    const state = signalState(initialState);
    // @ts-expect-error - Type 'number' is not assignable to type 'string'
    patchState(state, { ngrx: 10 });
  });

  it('fails when state is patched with a wrong updater function', () => {
    const state = signalState(initialState);
    // @ts-expect-error - Type 'string' is not assignable to type 'number'
    patchState(state, (s) => ({
      user: {
        ...s.user,
        age: '30',
      },
    }));
  });
});
