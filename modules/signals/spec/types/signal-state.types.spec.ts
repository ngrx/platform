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
    expectSnippet(`
      type FooState = { foo: string; bar: number };
      const state = signalState<FooState>({ foo: 'bar', bar: 1 });
    `).toInfer('state', 'SignalState<FooState>');
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

    expectSnippet(snippet).toInfer(
      'state',
      'SignalState<{ user: { age: number; details: { first: string; last: string; }; address: string[]; }; numbers: number[]; ngrx: string; }>'
    );

    expectSnippet(snippet).toInfer(
      'user',
      'DeepSignal<{ age: number; details: { first: string; last: string; }; address: string[]; }>'
    );

    expectSnippet(snippet).toInfer(
      'details',
      'DeepSignal<{ first: string; last: string; }>'
    );

    expectSnippet(snippet).toInfer('first', 'Signal<string>');

    expectSnippet(snippet).toInfer('last', 'Signal<string>');

    expectSnippet(snippet).toInfer('address', 'Signal<string[]>');

    expectSnippet(snippet).toInfer('numbers', 'Signal<number[]>');

    expectSnippet(snippet).toInfer('ngrx', 'Signal<string>');
  });

  it('does not create deep signals when state slice type is an interface', () => {
    expectSnippet(`
      interface User {
        firstName: string;
        lastName: string;
      }

      type State = { user: User };

      const state = signalState<State>({ user: { firstName: 'John', lastName: 'Smith' } });
      const user = state.user;
    `).toInfer('user', 'Signal<User>');
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

    expectSnippet(snippet).toInfer('state', 'SignalState<State>');

    expectSnippet(snippet).toInfer(
      'foo',
      'Signal<string | undefined> | undefined'
    );

    expectSnippet(snippet).toInfer(
      'bar',
      'DeepSignal<{ baz?: number | undefined; }>'
    );

    expectSnippet(snippet).toInfer(
      'baz',
      'Signal<number | undefined> | undefined'
    );

    expectSnippet(snippet).toInfer(
      'x',
      'Signal<{ y: { z?: boolean | undefined; }; } | undefined> | undefined'
    );
  });

  it('succeeds when state is an empty object', () => {
    expectSnippet(`const state = signalState({})`).toInfer(
      'state',
      'SignalState<{}>'
    );
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

    expectSnippet(snippet).toInfer('state', 'SignalState<State>');

    expectSnippet(snippet).toInfer('foo', 'Signal<number | { s: string; }>');

    expectSnippet(snippet).toInfer(
      'bar',
      'DeepSignal<{ baz: { n: number; } | null; }>'
    );

    expectSnippet(snippet).toInfer('baz', 'Signal<{ n: number; } | null>');

    expectSnippet(snippet).toInfer(
      'x',
      'DeepSignal<{ y: { z: boolean | undefined; }; }>'
    );

    expectSnippet(snippet).toInfer(
      'y',
      'DeepSignal<{ z: boolean | undefined; }>'
    );

    expectSnippet(snippet).toInfer('z', 'Signal<boolean | undefined>');
  });

  it('fails when state contains function properties', () => {
    expectSnippet(`const state = signalState({ name: '' })`).toFail(
      /@ngrx\/signals: state cannot contain `Function` properties/
    );

    expectSnippet(
      `const state = signalState({ foo: { arguments: [] } })`
    ).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);

    expectSnippet(
      `const state = signalState({ foo: { bar: { call: false }, baz: 1 } })`
    ).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);

    expectSnippet(
      `const state = signalState({ foo: { apply: 'apply', bar: true } })`
    ).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);

    expectSnippet(`const state = signalState({ bind: { foo: 'bar' } })`).toFail(
      /@ngrx\/signals: state cannot contain `Function` properties/
    );

    expectSnippet(
      `const state = signalState({ foo: { bar: { prototype: [] }; baz: 1 } })`
    ).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);

    expectSnippet(`const state = signalState({ foo: { length: 10 } })`).toFail(
      /@ngrx\/signals: state cannot contain `Function` properties/
    );

    expectSnippet(`const state = signalState({ caller: '' })`).toFail(
      /@ngrx\/signals: state cannot contain `Function` properties/
    );
  });

  it('fails when state is not an object', () => {
    expectSnippet(`const state = signalState(10);`).toFail();

    expectSnippet(`const state = signalState('');`).toFail();

    expectSnippet(`const state = signalState(null);`).toFail();

    expectSnippet(`const state = signalState(true);`).toFail();

    expectSnippet(`const state = signalState(['ng', 'rx']);`).toFail();
  });

  it('fails when state type is defined as an interface', () => {
    expectSnippet(`
      interface User {
        firstName: string;
        lastName: string;
      }

      const state = signalState<User>({ firstName: 'John', lastName: 'Smith' });
    `).toFail(
      /Type 'User' does not satisfy the constraint 'Record<string, unknown>'/
    );
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
