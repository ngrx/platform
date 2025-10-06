import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('signalState', () => {
  const expectSnippet = expecter(
    (code) => `
        import { patchState, signalState } from '@ngrx/signals';

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

        ${code}
      `,
    compilerOptions()
  );

  it('allows passing state as a generic argument', () => {
    const snippet = `
      type FooState = { foo: string; bar: number };
      const state = signalState<FooState>({ foo: 'bar', bar: 1 });
    `;

    const result = expectSnippet(snippet);

    result.toSucceed();
    result.toInfer('state', 'SignalState<FooState>');
  });

  it('creates deep signals for nested state slices', () => {
    const snippet = `
      const state = signalState(initialState);

      const user = state.user;
      const age = state.user.age;
      const details = state.user.details;
      const first = state.user.details.first;
      const last = state.user.details.last;
      const address = state.user.address;
      const numbers = state.numbers;
      const ngrx = state.ngrx;
    `;

    const result = expectSnippet(snippet);

    result.toSucceed();
    result.toInfer(
      'state',
      'SignalState<{ user: { age: number; details: { first: string; last: string; }; address: string[]; }; numbers: number[]; ngrx: string; }>'
    );
    result.toInfer(
      'user',
      'DeepSignal<{ age: number; details: { first: string; last: string; }; address: string[]; }>'
    );
    result.toInfer('details', 'DeepSignal<{ first: string; last: string; }>');
    result.toInfer('first', 'Signal<string>');
    result.toInfer('last', 'Signal<string>');
    result.toInfer('address', 'Signal<string[]>');
    result.toInfer('numbers', 'Signal<number[]>');
    result.toInfer('ngrx', 'Signal<string>');
  });

  it('creates deep signals when state type is an interface', () => {
    const snippet = `
      interface User {
        firstName: string;
        lastName: string;
      }

      interface State {
        user: User;
        bool: boolean;
        map: Map<string, string>;
        set: Set<{ foo: number }>;
      };

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
    `;

    const result = expectSnippet(snippet);

    result.toSucceed();
    result.toInfer('user', 'DeepSignal<User>');
    result.toInfer('lastName', 'Signal<string>');
    result.toInfer('bool', 'Signal<boolean>');
    result.toInfer('map', 'Signal<Map<string, string>>');
    result.toInfer('set', 'Signal<Set<{ foo: number; }>>');
  });

  it('does not create deep signals for iterables', () => {
    const snippet = `
      const arrayState = signalState<string[]>([]);
      const arrayStateValue = arrayState();
      declare const arrayStateKeys: keyof typeof arrayState;

      const setState = signalState(new Set<number>());
      const setStateValue = setState();
      declare const setStateKeys: keyof typeof setState;

      const mapState = signalState(new Map<number, { bar: boolean }>());
      const mapStateValue = mapState();
      declare const mapStateKeys: keyof typeof mapState;

      const uintArrayState = signalState(new Uint8ClampedArray());
      const uintArrayStateValue = uintArrayState();
      declare const uintArrayStateKeys: keyof typeof uintArrayState;
    `;

    const result = expectSnippet(snippet);

    result.toSucceed();
    result.toInfer('arrayStateValue', 'string[]');
    result.toInfer('arrayStateKeys', 'unique symbol | unique symbol');
    result.toInfer('setStateValue', 'Set<number>');
    result.toInfer('setStateKeys', 'unique symbol | unique symbol');
    result.toInfer('mapStateValue', 'Map<number, { bar: boolean; }>');
    result.toInfer('mapStateKeys', 'unique symbol | unique symbol');
    result.toInfer('uintArrayStateValue', 'Uint8ClampedArray<ArrayBuffer>');
    result.toInfer('uintArrayStateKeys', 'unique symbol | unique symbol');
  });

  it('does not create deep signals for built-in object types', () => {
    const snippet = `
      const weakSetState = signalState(new WeakSet<{ foo: string }>());
      const weakSetStateValue = weakSetState();
      declare const weakSetStateKeys: keyof typeof weakSetState;

      const dateState = signalState(new Date());
      const dateStateValue = dateState();
      declare const dateStateKeys: keyof typeof dateState;

      const errorState = signalState(new Error());
      const errorStateValue = errorState();
      declare const errorStateKeys: keyof typeof errorState;

      const regExpState = signalState(new RegExp(''));
      const regExpStateValue = regExpState();
      declare const regExpStateKeys: keyof typeof regExpState;
    `;

    const result = expectSnippet(snippet);

    result.toSucceed();
    result.toInfer('weakSetStateValue', 'WeakSet<{ foo: string; }>');
    result.toInfer('weakSetStateKeys', 'unique symbol | unique symbol');
    result.toInfer('dateStateValue', 'Date');
    result.toInfer('dateStateKeys', 'unique symbol | unique symbol');
    result.toInfer('errorStateValue', 'Error');
    result.toInfer('errorStateKeys', 'unique symbol | unique symbol');
    result.toInfer('regExpStateValue', 'RegExp');
    result.toInfer('regExpStateKeys', 'unique symbol | unique symbol');
  });

  it('does not create deep signals for functions', () => {
    const snippet = `
      const state = signalState(() => {});
      const stateValue = state();
      declare const stateKeys: keyof typeof state;
    `;

    const result = expectSnippet(snippet);

    result.toSucceed();
    result.toInfer('stateValue', '() => void');
    result.toInfer('stateKeys', 'unique symbol | unique symbol');
  });

  it('does not create deep signals for optional state slices', () => {
    const snippet = `
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
    `;

    const result = expectSnippet(snippet);

    result.toSucceed();
    result.toInfer('state', 'SignalState<State>');
    result.toInfer('foo', 'Signal<string | undefined> | undefined');
    result.toInfer('bar', 'DeepSignal<{ baz?: number | undefined; }>');
    result.toInfer('baz', 'Signal<number | undefined> | undefined');
    result.toInfer(
      'x',
      'Signal<{ y: { z?: boolean | undefined; }; } | undefined> | undefined'
    );
  });

  it('does not create deep signals for unknown records', () => {
    const snippet = `
      const state1 = signalState<{ [key: string]: number }>({});
      declare const state1Keys: keyof typeof state1;

      const state2 = signalState<{ [key: number]: { foo: string } }>({
         1: { foo: 'bar' },
      });
      declare const state2Keys: keyof typeof state2;

      const state3 = signalState<Record<string, { bar: number }>>({});
      declare const state3Keys: keyof typeof state3;

      const state4 = signalState({
        foo: {} as Record<string, { bar: boolean } | number>,
      });
      const foo = state4.foo;

      const state5 = signalState({
        bar: { baz: {} as Record<number, unknown> }
      });
      const bar = state5.bar;
      const baz = bar.baz;

      const state6 = signalState({
        x: {} as Record<symbol, string>
      });
      const x = state6.x;

      const state7 = signalState({ y: {} });
      const y = state7.y;
    `;

    const result = expectSnippet(snippet);

    result.toSucceed();
    result.toInfer('state1', 'SignalState<{ [key: string]: number; }>');
    result.toInfer('state1Keys', 'unique symbol | unique symbol');
    result.toInfer(
      'state2',
      'SignalState<{ [key: number]: { foo: string; }; }>'
    );
    result.toInfer('state2Keys', 'unique symbol | unique symbol');
    result.toInfer('state3', 'SignalState<Record<string, { bar: number; }>>');
    result.toInfer('state3Keys', 'unique symbol | unique symbol');
    result.toInfer(
      'state4',
      'SignalState<{ foo: Record<string, number | { bar: boolean; }>; }>'
    );
    result.toInfer('foo', 'Signal<Record<string, number | { bar: boolean; }>>');
    result.toInfer(
      'state5',
      'SignalState<{ bar: { baz: Record<number, unknown>; }; }>'
    );
    result.toInfer('bar', 'DeepSignal<{ baz: Record<number, unknown>; }>');
    result.toInfer('baz', 'Signal<Record<number, unknown>>');
    result.toInfer('state6', 'SignalState<{ x: Record<symbol, string>; }>');
    result.toInfer('x', 'Signal<Record<symbol, string>>');
    result.toInfer('state7', 'SignalState<{ y: {}; }>');
    result.toInfer('y', 'Signal<{}>');
  });

  it('succeeds when state is an empty object', () => {
    const snippet = `const state = signalState({})`;

    const result = expectSnippet(snippet);

    result.toSucceed();
    result.toInfer('state', 'SignalState<{}>');
  });

  it('succeeds when state slices are union types', () => {
    const snippet = `
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
    `;

    const result = expectSnippet(snippet);

    result.toSucceed();
    result.toInfer('state', 'SignalState<State>');
    result.toInfer('foo', 'Signal<number | { s: string; }>');
    result.toInfer('bar', 'DeepSignal<{ baz: { n: number; } | null; }>');
    result.toInfer('baz', 'Signal<{ n: number; } | null>');
    result.toInfer('x', 'DeepSignal<{ y: { z: boolean | undefined; }; }>');
    result.toInfer('y', 'DeepSignal<{ z: boolean | undefined; }>');
    result.toInfer('z', 'Signal<boolean | undefined>');
  });

  it('succeeds when state contains Function properties', () => {
    const snippet = `
      const state1 = signalState({ name: 0 });
      const state2 = signalState({ foo: { length: [] as boolean[] } });
      const state3 = signalState({ name: { length: '' } });

      const name = state1.name;
      const length1 = state2.foo.length;
      const name2 = state3.name;
      const length2 = state3.name.length;
    `;

    const result = expectSnippet(snippet);

    result.toSucceed();
    result.toInfer('name', 'Signal<number>');
    result.toInfer('length1', 'Signal<boolean[]>');
    result.toInfer('name2', 'DeepSignal<{ length: string; }>');
    result.toInfer('length2', 'Signal<string>');
  });

  it('fails when state is not an object', () => {
    expectSnippet(`const state = signalState(10);`).toFail();

    expectSnippet(`const state = signalState('');`).toFail();

    expectSnippet(`const state = signalState(null);`).toFail();

    expectSnippet(`const state = signalState(true);`).toFail();
  });

  it('patches state via sequence of partial state objects and updater functions', () => {
    expectSnippet(`
      const state = signalState(initialState);

      patchState(
        state,
        { numbers: [10, 100, 1000] },
        (state) => ({ user: { ...state.user, age: state.user.age + 1 } }),
        { ngrx: 'signals' }
      );
    `).toSucceed();
  });

  it('fails when state is patched with a non-record', () => {
    expectSnippet(`
      const state = signalState(initialState);
      patchState(state, 10);
    `).toFail();

    expectSnippet(`
      const state = signalState(initialState);
      patchState(state, undefined);
    `).toFail();

    expectSnippet(`
      const state = signalState(initialState);
      patchState(state, [1, 2, 3]);
    `).toFail();
  });

  it('fails when state is patched with a wrong record', () => {
    expectSnippet(`
      const state = signalState(initialState);
      patchState(state, { ngrx: 10 });
    `).toFail(/Type 'number' is not assignable to type 'string'/);
  });

  it('fails when state is patched with a wrong updater function', () => {
    expectSnippet(`
      const state = signalState(initialState);
      patchState(state, (state) => ({ user: { ...state.user, age: '30' } }));
    `).toFail(/Type 'string' is not assignable to type 'number'/);
  });
});
