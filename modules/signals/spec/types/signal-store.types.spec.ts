import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('signalStore', () => {
  const expectSnippet = expecter(
    (code) => `
        import { inject, Signal } from '@angular/core';
        import {
          patchState,
          selectSignal,
          signalStore,
          signalStoreFeature,
          type,
          withHooks,
          withMethods,
          withSignals,
          withState,
        } from '@ngrx/signals';

        ${code}
      `,
    compilerOptions()
  );

  it('allows passing state as a generic argument', () => {
    const snippet = `
      type State = { foo: string; bar: number[] };
      const Store = signalStore(
        withState<State>({ foo: 'bar', bar: [1, 2] })
      );
    `;

    expectSnippet(snippet).toInfer(
      'Store',
      'Type<{ foo: Signal<string>; bar: Signal<number[]>; [STATE_SIGNAL]: WritableSignal<{ foo: string; bar: number[]; }>; }>'
    );
  });

  it('creates deep signals for nested state slices', () => {
    const snippet = `
      const Store = signalStore(
        withState({
          user: {
            age: 10,
            details: {
              first: 'John',
              flags: [true, false],
            },
          },
        })
      );

      const store = new Store();
      const user = store.user;
      const age = store.user.age;
      const details = store.user.details;
      const first = store.user.details.first;
      const flags = store.user.details.flags;
    `;

    expectSnippet(snippet).toInfer(
      'store',
      '{ user: DeepSignal<{ age: number; details: { first: string; flags: boolean[]; }; }>; [STATE_SIGNAL]: WritableSignal<{ user: { age: number; details: { first: string; flags: boolean[]; }; }; }>; }'
    );

    expectSnippet(snippet).toInfer(
      'user',
      'DeepSignal<{ age: number; details: { first: string; flags: boolean[]; }; }>'
    );

    expectSnippet(snippet).toInfer(
      'details',
      'DeepSignal<{ first: string; flags: boolean[]; }>'
    );

    expectSnippet(snippet).toInfer('first', 'Signal<string>');

    expectSnippet(snippet).toInfer('flags', 'Signal<boolean[]>');
  });

  it('does not create deep signals when state slice type is an interface', () => {
    expectSnippet(`
      interface User {
        firstName: string;
        lastName: string;
      }

      type State = { user: User };

      const Store = signalStore(
        withState<State>({ user: { firstName: 'John', lastName: 'Smith' } })
      );

      const store = new Store();
      const user = store.user;
    `).toInfer('user', 'Signal<User>');
  });

  it('succeeds when state is an empty object', () => {
    expectSnippet(`const Store = signalStore(withState({}))`).toInfer(
      'Store',
      'Type<{ [STATE_SIGNAL]: WritableSignal<{}>; }>'
    );
  });

  it('succeeds when state slices are union types', () => {
    const snippet = `
      type State = {
        foo: { s: string } | number;
        bar: { baz: { b: boolean } | null };
        x: { y: { z: number | undefined } };
      };

      const Store = signalStore(
        withState<State>({
          foo: { s: 's' },
          bar: { baz: null },
          x: { y: { z: undefined } },
        })
      );
      const store = inject(Store);
      const foo = store.foo;
      const bar = store.bar;
      const baz = store.bar.baz;
      const x = store.x;
      const y = store.x.y;
      const z = store.x.y.z;
    `;

    expectSnippet(snippet).toInfer(
      'store',
      '{ foo: Signal<number | { s: string; }>; bar: DeepSignal<{ baz: { b: boolean; } | null; }>; x: DeepSignal<{ y: { z: number | undefined; }; }>; [STATE_SIGNAL]: WritableSignal<...>; }'
    );

    expectSnippet(snippet).toInfer('foo', 'Signal<number | { s: string; }>');

    expectSnippet(snippet).toInfer(
      'bar',
      'DeepSignal<{ baz: { b: boolean; } | null; }>'
    );

    expectSnippet(snippet).toInfer('baz', 'Signal<{ b: boolean; } | null>');

    expectSnippet(snippet).toInfer(
      'x',
      'DeepSignal<{ y: { z: number | undefined; }; }>'
    );

    expectSnippet(snippet).toInfer(
      'y',
      'DeepSignal<{ z: number | undefined; }>'
    );

    expectSnippet(snippet).toInfer('z', 'Signal<number | undefined>');
  });

  it('succeeds when root state slices contain function properties', () => {
    expectSnippet(`
      const Store = signalStore(
        withState({
          name: { x: { y: 'z' } },
          arguments: [1, 2, 3],
          call: false,
        })
      );
    `).toInfer(
      'Store',
      'Type<{ name: DeepSignal<{ x: { y: string; }; }>; arguments: Signal<number[]>; call: Signal<boolean>; [STATE_SIGNAL]: WritableSignal<{ name: { x: { y: string; }; }; arguments: number[]; call: boolean; }>; }>'
    );

    expectSnippet(`
      const Store = signalStore(
        withState({
          apply: 'apply',
          bind: { foo: 'bar' },
          prototype: ['ngrx'],
        })
      );
    `).toInfer(
      'Store',
      ' Type<{ apply: Signal<string>; bind: DeepSignal<{ foo: string; }>; prototype: Signal<string[]>; [STATE_SIGNAL]: WritableSignal<{ apply: string; bind: { foo: string; }; prototype: string[]; }>; }>'
    );

    expectSnippet(`
      const Store = signalStore(
        withState({
          length: 10,
          caller: undefined,
        })
      );
    `).toInfer(
      'Store',
      'Type<{ length: Signal<number>; caller: Signal<undefined>; [STATE_SIGNAL]: WritableSignal<{ length: number; caller: undefined; }>; }>'
    );
  });

  it('fails when nested state slices contain function properties', () => {
    expectSnippet(`
      const Store = signalStore(withState({ x: { name?: '' } }));
    `).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);

    expectSnippet(`
      const Store = signalStore(withState({ x: { arguments: [] } }));
    `).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);

    expectSnippet(`
      const Store = signalStore(
        withState({ x: { bar: { call: false }, baz: 1 } })
      );
    `).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);

    expectSnippet(`
      const Store = signalStore(
        withState({ x: { apply: 'apply', bar: true } })
      )
    `).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);

    expectSnippet(`
      const Store = signalStore(
        withState({ x: { bind: { foo: 'bar' } } })
      );
    `).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);

    expectSnippet(`
      const Store = signalStore(
        withState({ x: { bar: { prototype: [] }; baz: 1 } })
      );
    `).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);

    expectSnippet(`
      const Store = signalStore(withState({ x: { length: 10 } }));
    `).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);

    expectSnippet(`
      const Store = signalStore(withState({ x: { caller: '' } }));
    `).toFail(/@ngrx\/signals: state cannot contain `Function` properties/);
  });

  it('succeeds when nested state slices are optional', () => {
    const snippet = `
      type State = {
        bar: { baz?: number };
        x: { y?: { z: boolean } };
      };

      const Store = signalStore(withState<State>({ bar: {}, x: {} }));

      const store = new Store();
      const bar = store.bar;
      const baz = store.bar.baz;
      const x = store.x;
      const y = store.x.y;
    `;

    expectSnippet(snippet).toInfer(
      'store',
      '{ bar: DeepSignal<{ baz?: number | undefined; }>; x: DeepSignal<{ y?: { z: boolean; } | undefined; }>; [STATE_SIGNAL]: WritableSignal<{ bar: { baz?: number | undefined; }; x: { y?: { ...; } | undefined; }; }>; }'
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
      'DeepSignal<{ y?: { z: boolean; } | undefined; }>'
    );

    expectSnippet(snippet).toInfer(
      'y',
      'Signal<{ z: boolean; } | undefined> | undefined'
    );
  });

  it('fails when root state slices are optional', () => {
    expectSnippet(`
      type State = {
        foo?: { s: string };
        bar: number;
      };

      const Store = signalStore(
        withState<State>({ foo: { s: '' }, bar: 1 })
      );
    `).toFail(/@ngrx\/signals: state cannot contain optional properties/);
  });

  it('fails when state is not an object', () => {
    expectSnippet(`const Store = signalStore(withState(10));`).toFail();

    expectSnippet(`const Store = signalStore(withState(''));`).toFail();

    expectSnippet(`const Store = signalStore(withState(null));`).toFail();

    expectSnippet(`const Store = signalStore(withState(true));`).toFail();

    expectSnippet(
      `const Store = signalStore(withState(['ng', 'rx']));`
    ).toFail();
  });

  it('fails when state type is defined as an interface', () => {
    expectSnippet(`
      interface User {
        firstName: string;
        lastName: string;
      }

      const Store = signalStore(
        withState<User>({ firstName: 'John', lastName: 'Smith' })
      );
    `).toFail(
      /Type 'User' does not satisfy the constraint 'Record<string, unknown>'/
    );
  });

  it('patches state via sequence of partial state objects and updater functions', () => {
    expectSnippet(`
      const Store = signalStore(
        withState({ ngrx: 'signals' }),
        withState({ user: { age: 10, first: 'John' } }),
        withMethods((store) => {
          patchState(
            store,
            (state) => ({ user: { ...state.user, first: 'Peter' } }),
            { ngrx: 'rocks' }
          );

          return {};
        }),
        withState({ flags: [true, false, true] }),
        withMethods(({ ngrx, flags, ...store }) => {
          patchState(
            store,
            { ngrx: 'rocks' },
            (state) => ({ flags: [...state.flags, true] })
          );

          return {};
        })
      );

      const store = new Store();
      patchState(
        store,
        { flags: [true] },
        (state) => ({ user: { ...state.user, age: state.user.age + 1 } }),
        { ngrx: 'store' }
      );
    `).toSucceed();
  });

  it('fails when state is patched with a non-record', () => {
    expectSnippet(`
      const Store = signalStore(withState({ foo: 'bar' }));

      const store = new Store();
      patchState(store, 10);
    `).toFail();

    expectSnippet(`
      const Store = signalStore(withState({ foo: 'bar' }));

      const store = new Store();
      patchState(store, undefined);
    `).toFail();

    expectSnippet(`
      const Store = signalStore(withState({ foo: 'bar' }));

      const store = new Store();
      patchState(store, [1, 2, 3]);
    `).toFail();
  });

  it('fails when state is patched with a wrong record', () => {
    expectSnippet(`
      const Store = signalStore(withState({ foo: 'bar' }));

      const store = new Store();
      patchState(store, { foo: 10 });
    `).toFail(/Type 'number' is not assignable to type 'string'/);

    expectSnippet(`
      const Store = signalStore(
        withState({ foo: 'bar' }),
        withMethods((store) => {
          patchState(store, { foo: 10 });
          return {};
        })
      );
    `).toFail(/Type 'number' is not assignable to type 'string'/);

    expectSnippet(`
      const Store = signalStore(
        withState({ foo: 'bar' }),
        withMethods(({ foo, ...store }) => {
          patchState(store, { foo: 10 });
          return {};
        })
      );
    `).toFail(/Type 'number' is not assignable to type 'string'/);
  });

  it('fails when state is patched with a wrong updater function', () => {
    expectSnippet(`
      const Store = signalStore(
        withState({ user: { first: 'John', age: 20 } })
      );

      const store = new Store();
      patchState(store, (state) => ({ user: { ...state.user, age: '30' } }));
    `).toFail(/Type 'string' is not assignable to type 'number'/);

    expectSnippet(`
      const Store = signalStore(
        withState({ user: { first: 'John', age: 20 } }),
        withMethods((store) => {
          patchState(store, (state) => ({ user: { ...state.user, age: '30' } }));
          return {};
        })
      );
    `).toFail(/Type 'string' is not assignable to type 'number'/);

    expectSnippet(`
      const Store = signalStore(
        withState({ user: { first: 'John', age: 20 } }),
        withMethods(({ user, ...store }) => {
          patchState(store, (state) => ({ user: { ...state.user, first: 10 } }));
          return {};
        })
      );
    `).toFail(/Type 'number' is not assignable to type 'string'/);
  });

  it('allows injecting store using the `inject` function', () => {
    expectSnippet(`
      const Store = signalStore(
        withState({ ngrx: 'rocks', x: { y: 'z' } }),
        withSignals(() => ({ signals: selectSignal(() => [1, 2, 3]) })),
        withMethods(() => ({
          mgmt(arg: boolean): number {
            return 1;
          }
        }))
      );

      const store = inject(Store);
    `).toInfer(
      'store',
      '{ ngrx: Signal<string>; x: DeepSignal<{ y: string; }>; signals: Signal<number[]>; mgmt: (arg: boolean) => number; [STATE_SIGNAL]: WritableSignal<{ ngrx: string; x: { y: string; }; }>; }'
    );
  });

  it('allows using store via constructor-based dependency injection', () => {
    expectSnippet(`
      const Store = signalStore(
        withState({ foo: 10 }),
        withSignals(({ foo }) => ({ bar: selectSignal(() => foo() + '1') })),
        withMethods(() => ({
          baz(x: number): void {}
        }))
      );

      type Store = InstanceType<typeof Store>;

      class Component {
        constructor (readonly store: Store) {}
      }

      const component = new Component(new Store());
      const store = component.store;
    `).toInfer(
      'store',
      '{ foo: Signal<number>; bar: Signal<string>; baz: (x: number) => void; [STATE_SIGNAL]: WritableSignal<{ foo: number; }>; }'
    );
  });

  describe('custom features', () => {
    const baseSnippet = `
      function withX() {
        return signalStoreFeature(withState({ x: 1 }));
      }

      type Y = { a: string; b: number };
      const initialY: Y = { a: '', b: 5 };

      function withY<_>() {
        return signalStoreFeature(
          {
            state: type<{ q1: string }>(),
            signals: type<{ sig: Signal<boolean> }>(),
          },
          withState({ y: initialY }),
          withSignals(() => ({ sigY: selectSignal(() => 'sigY') })),
          withHooks({
            onInit({ q1, y, sigY, ...store }) {
              patchState(store, { q1: '', y: { a: 'a', b: 2 } });
            },
          })
        );
      }

      function withZ<_>() {
        return signalStoreFeature(
          { methods: type<{ f: () => void }>() },
          withMethods(({ f }) => ({
            z() {
              f();
            }
          }))
        );
      }
    `;

    it('combines custom features', () => {
      expectSnippet(`
        function withFoo() {
          return withState({ foo: 'foo' });
        }

        function withBar() {
          return signalStoreFeature(
            { state: type<{ foo: string }>() },
            withState({ bar: 'bar' })
          );
        }

        export function withBaz() {
          return signalStoreFeature(
            withFoo(),
            withState({ count: 0 }),
            withBar()
          );
        }

        export function withBaz2() {
          return signalStoreFeature(
            withState({ foo: 'foo' }),
            withState({ count: 0 }),
            withBar()
          );
        }

        const BazStore = signalStore(
          withFoo(),
          withState({ count: 0 }),
          withBar()
        );

        const Baz2Store = signalStore(
          withState({ foo: 'foo' }),
          withState({ count: 0 }),
          withBar()
        );
      `).toSucceed();

      expectSnippet(
        baseSnippet +
          `
          const Store = signalStore(
            withSignals(() => ({ sig: selectSignal(() => 1) })),
            withMethods(() => ({ q1: () => false })),
            withSignals(() => ({ sig: selectSignal(() => false) })),
            withState({ q1: 'q1', q2: 'q2' }),
            withX(),
            withY(),
            withSignals(() => ({ q1: selectSignal(() => 10) })),
            withMethods((store) => ({
              f() {
                patchState(store, { x: 1, y: { a: '', b: 0 }, q2: 'q2new' });
              },
            })),
            withZ()
          );

          const feature = signalStoreFeature(
            { signals: type<{ sig: Signal<boolean> }>() },
            withX(),
            withState({ q1: 'q1' }),
            withY(),
            withMethods((store) => ({
              f() {
                patchState(store, { x: 1, q1: 'xyz', y: { a: '', b: 0 } });
              },
            })),
            withZ()
          );
          `
      ).toSucceed();
    });

    it('fails when custom feature is used with wrong input', () => {
      expectSnippet(
        baseSnippet + 'const Store = signalStore(withY());'
      ).toFail();

      expectSnippet(
        baseSnippet + 'const withY2 = () => signalStoreFeature(withY());'
      ).toFail();

      expectSnippet(
        baseSnippet +
          `
          const Store = signalStore(
            withSignals(() => ({ sig: selectSignal(() => 1) })),
            withState({ q1: 'q1', q2: 'q2' }),
            withState({ q1: 1 }),
            withSignals(() => ({ sig: selectSignal(() => false) })),
            withX(),
            withY(),
            withSignals(() => ({ q1: selectSignal(() => 10) })),
            withMethods((store) => ({
              f() {
                patchState(store, { x: 1, y: { a: '', b: 0 }, q2: 'q2new' });
              },
            }))
          );
          `
      ).toFail();

      expectSnippet(
        baseSnippet +
          `
          const feature = signalStoreFeature(
            { signals: type<{ sig: Signal<boolean> }>() },
            withSignals(() => ({ sig: selectSignal(() => 1) })),
            withX(),
            withState({ q1: 'q1' }),
            withY(),
            withMethods((store) => ({
              f() {
                patchState(store, { x: 1, q1: 'xyz', y: { a: '', b: 0 } });
              },
            }))
          );
          `
      ).toFail();

      expectSnippet(
        baseSnippet +
          `
          const Store = signalStore(
            withSignals(() => ({ sig: selectSignal(() => 1) })),
            withState({ q1: 1 }),
            withState({ q1: 'q1', q2: 'q2' }),
            withSignals(() => ({ sig: selectSignal(() => false) })),
            withX(),
            withY(),
            withSignals(() => ({ q1: selectSignal(() => 10) })),
            withMethods((store) => ({
              f() {
                patchState(store, { x: 1, y: { a: '', b: 0 }, q2: 'q2new' });
              },
            }))
          );

          const feature = signalStoreFeature(
            { signals: type<{ sig: Signal<boolean> }>() },
            withSignals(() => ({ sig: selectSignal(() => 1) })),
            withX(),
            withState({ q1: 'q1' }),
            withSignals(() => ({ sig: selectSignal(() => false) })),
            withY(),
            withMethods((store) => ({
              f() {
                patchState(store, { x: 1, q1: 'xyz', y: { a: '', b: 0 } });
              },
            }))
          );
          `
      ).toSucceed();
    });
  });
});
