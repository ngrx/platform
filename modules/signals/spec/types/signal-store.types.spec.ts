import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('signalStore', () => {
  const expectSnippet = expecter(
    (code) => `
        import { computed, inject, Signal } from '@angular/core';
        import {
          getState,
          patchState,
          signalStore,
          signalStoreFeature,
          type,
          withComputed,
          withHooks,
          withMethods,
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

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'Store',
      'Type<{ foo: Signal<string>; bar: Signal<number[]>; } & StateSource<{ foo: string; bar: number[]; }>>'
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

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'store',
      '{ user: DeepSignal<{ age: number; details: { first: string; flags: boolean[]; }; }>; } & StateSource<{ user: { age: number; details: { first: string; flags: boolean[]; }; }; }>'
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

  it('does not create deep signals when state slices are unknown records', () => {
    const snippet = `
      type State = {
        foo: { [key: string]: string };
        bar: { baz: Record<number, boolean> };
        x: { y: { z: Record<string, { foo: number } | boolean> } };
      }

      const Store = signalStore(
        withState<State>({
          foo: {},
          bar: { baz: {} },
          x: { y: { z: {} } },
        })
      );

      const store = new Store();
      const foo = store.foo;
      const baz = store.bar.baz;
      const z = store.x.y.z;
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer('foo', 'Signal<{ [key: string]: string; }>');

    expectSnippet(snippet).toInfer('baz', 'Signal<Record<number, boolean>>');

    expectSnippet(snippet).toInfer(
      'z',
      'Signal<Record<string, boolean | { foo: number; }>>'
    );
  });

  it('creates deep signals when state type is an interface', () => {
    const snippet = `
      interface User {
        firstName: string;
        lastName: string;
      }

      interface State {
        user: User;
        num: number;
        map: Map<string, { foo: number }>;
        set: Set<number>;
      }

      const Store = signalStore(
        withState<State>({
          user: { firstName: 'John', lastName: 'Smith' },
          num: 10,
          map: new Map<string, { foo: number }>(),
          set: new Set<number>(),
        })
      );

      const store = new Store();
      const user = store.user;
      const firstName = store.user.firstName;
      const num = store.num;
      const map = store.map;
      const set = store.set;
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer('user', 'DeepSignal<User>');

    expectSnippet(snippet).toInfer('firstName', 'Signal<string>');

    expectSnippet(snippet).toInfer('num', 'Signal<number>');

    expectSnippet(snippet).toInfer(
      'map',
      'Signal<Map<string, { foo: number; }>>'
    );

    expectSnippet(snippet).toInfer('set', 'Signal<Set<number>>');
  });

  it('does not create deep signals when state type is an iterable', () => {
    const snippet = `
      const ArrayStore = signalStore(withState<number[]>([]));
      const arrayStore = new ArrayStore();
      declare const arrayStoreKeys: keyof typeof arrayStore;

      const SetStore = signalStore(withState(new Set<{ foo: string }>()));
      const setStore = new SetStore();
      declare const setStoreKeys: keyof typeof setStore;

      const MapStore = signalStore(withState(new Map<string, { foo: number }>()));
      const mapStore = new MapStore();
      declare const mapStoreKeys: keyof typeof mapStore;

      const FloatArrayStore = signalStore(withState(new Float32Array()));
      const floatArrayStore = new FloatArrayStore();
      declare const floatArrayStoreKeys: keyof typeof floatArrayStore;
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer('arrayStoreKeys', 'unique symbol');
    expectSnippet(snippet).toInfer('setStoreKeys', 'unique symbol');
    expectSnippet(snippet).toInfer('mapStoreKeys', 'unique symbol');
    expectSnippet(snippet).toInfer('floatArrayStoreKeys', 'unique symbol');
  });

  it('does not create deep signals when state type is a built-in object type', () => {
    const snippet = `
      const WeakMapStore = signalStore(withState(new WeakMap<{ foo: string }, { bar: number }>()));
      const weakMapStore = new WeakMapStore();
      declare const weakMapStoreKeys: keyof typeof weakMapStore;

      const DateStore = signalStore(withState(new Date()));
      const dateStore = new DateStore();
      declare const dateStoreKeys: keyof typeof dateStore;

      const ErrorStore = signalStore(withState(new Error()));
      const errorStore = new ErrorStore();
      declare const errorStoreKeys: keyof typeof errorStore;

      const RegExpStore = signalStore(withState(new RegExp('')));
      const regExpStore = new RegExpStore();
      declare const regExpStoreKeys: keyof typeof regExpStore;
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer('weakMapStoreKeys', 'unique symbol');
    expectSnippet(snippet).toInfer('dateStoreKeys', 'unique symbol');
    expectSnippet(snippet).toInfer('errorStoreKeys', 'unique symbol');
    expectSnippet(snippet).toInfer('regExpStoreKeys', 'unique symbol');
  });

  it('does not create deep signals when state type is a function', () => {
    const snippet = `
      const Store = signalStore(withState(() => () => {}));
      const store = new Store();
      declare const storeKeys: keyof typeof store;
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer('storeKeys', 'unique symbol');
  });

  it('succeeds when state is an empty object', () => {
    const snippet = `const Store = signalStore(withState({}))`;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer('Store', 'Type<{} & StateSource<{}>>');
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

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'store',
      '{ foo: Signal<number | { s: string; }>; bar: DeepSignal<{ baz: { b: boolean; } | null; }>; x: DeepSignal<{ y: { z: number | undefined; }; }>; } & StateSource<{ foo: number | { ...; }; bar: { ...; }; x: { ...; }; }>'
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

  it('succeeds when root state slices contain Function properties', () => {
    const snippet1 = `
      const Store = signalStore(
        withState({
          name: { x: { y: 'z' } },
          arguments: [1, 2, 3],
          call: false,
        })
      );
    `;

    expectSnippet(snippet1).toSucceed();

    expectSnippet(snippet1).toInfer(
      'Store',
      'Type<{ name: DeepSignal<{ x: { y: string; }; }>; arguments: Signal<number[]>; call: Signal<boolean>; } & StateSource<{ name: { x: { y: string; }; }; arguments: number[]; call: boolean; }>>'
    );

    const snippet2 = `
      const Store = signalStore(
        withState({
          apply: 'apply',
          bind: { foo: 'bar' },
          prototype: ['ngrx'],
        })
      );
    `;

    expectSnippet(snippet2).toSucceed();

    expectSnippet(snippet2).toInfer(
      'Store',
      'Type<{ apply: Signal<string>; bind: DeepSignal<{ foo: string; }>; prototype: Signal<string[]>; } & StateSource<{ apply: string; bind: { foo: string; }; prototype: string[]; }>>'
    );

    const snippet3 = `
      const Store = signalStore(
        withState({
          length: 10,
          caller: undefined,
        })
      );
    `;

    expectSnippet(snippet3).toSucceed();

    expectSnippet(snippet3).toInfer(
      'Store',
      'Type<{ length: Signal<number>; caller: Signal<undefined>; } & StateSource<{ length: number; caller: undefined; }>>'
    );
  });

  it('succeeds when nested state slices contain Function properties', () => {
    const snippet1 = `
      type State = { x: { name?: string } };
      const Store = signalStore(withState<State>({ x: { name: '' } }));
      const store = new Store();
      const name = store.x.name;
    `;

    expectSnippet(snippet1).toSucceed();
    expectSnippet(snippet1).toInfer(
      'name',
      'Signal<string | undefined> | undefined'
    );

    const snippet2 = `
      const Store = signalStore(
        withState({ x: { length: { name: false }, baz: 1 } })
      );
      const store = new Store();
      const length = store.x.length;
      const name = store.x.length.name;
    `;

    expectSnippet(snippet2).toSucceed();
    expectSnippet(snippet2).toInfer('length', 'DeepSignal<{ name: boolean; }>');
    expectSnippet(snippet2).toInfer('name', 'Signal<boolean>');
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

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'store',
      '{ bar: DeepSignal<{ baz?: number | undefined; }>; x: DeepSignal<{ y?: { z: boolean; } | undefined; }>; } & StateSource<{ bar: { baz?: number | undefined; }; x: { y?: { z: boolean; } | undefined; }; }>'
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

  it('succeeds when root state slices are optional', () => {
    const snippet = `
      type State = {
        foo?: { s: string };
        bar: number;
      };

      const Store = signalStore(
        withState<State>({ foo: { s: '' }, bar: 1 })
      );
      const store = new Store();
      const foo = store.foo;
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer(
      'foo',
      'Signal<{ s: string; } | undefined> | undefined'
    );
  });

  it('does not create deep signals when state is an unknown record', () => {
    const snippet1 = `
      const Store = signalStore(withState<{ [key: string]: number }>({}));
      const store = new Store();
      declare const storeKeys: keyof typeof store;
    `;

    expectSnippet(snippet1).toSucceed();
    expectSnippet(snippet1).toInfer('storeKeys', 'unique symbol');

    const snippet2 = `
      const Store = signalStore(
        withState<{ [key: number]: { bar: string } }>({})
      );
      const store = new Store();
      declare const storeKeys: keyof typeof store;
    `;

    expectSnippet(snippet2).toSucceed();
    expectSnippet(snippet2).toInfer('storeKeys', 'unique symbol');

    const snippet3 = `
      const Store = signalStore(
        withState<Record<string, { foo: boolean } | number>>({
          x: { foo: true },
          y: 1,
        })
      );
      const store = new Store();
      declare const storeKeys: keyof typeof store;
    `;

    expectSnippet(snippet3).toSucceed();
    expectSnippet(snippet3).toInfer('storeKeys', 'unique symbol');
  });

  it('fails when state is not an object', () => {
    expectSnippet(`const Store = signalStore(withState(10));`).toFail();

    expectSnippet(`const Store = signalStore(withState(''));`).toFail();

    expectSnippet(`const Store = signalStore(withState(null));`).toFail();

    expectSnippet(`const Store = signalStore(withState(true));`).toFail();
  });

  it('exposes readonly state source when protectedState is not provided', () => {
    const snippet = `
      const CounterStore1 = signalStore(withState({ count: 0 }));
      const CounterStore2 = signalStore(
        { providedIn: 'root' },
        withState({ count: 0 })
      );

      const store1 = new CounterStore1();
      const state1 = getState(store1);

      const store2 = new CounterStore2();
      const state2 = getState(store2);
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'store1',
      '{ count: Signal<number>; } & StateSource<{ count: number; }>'
    );

    expectSnippet(snippet).toInfer('state1', '{ count: number; }');

    expectSnippet(`
      ${snippet}
      patchState(store1, { count: 1 });
    `).toFail();

    expectSnippet(snippet).toInfer(
      'store2',
      '{ count: Signal<number>; } & StateSource<{ count: number; }>'
    );

    expectSnippet(snippet).toInfer('state2', '{ count: number; }');

    expectSnippet(`
      ${snippet}
      patchState(store2, { count: 1 });
    `).toFail();
  });

  it('exposes readonly state source when protectedState is true', () => {
    const snippet = `
      const CounterStore1 = signalStore(
        { protectedState: true },
        withState({ count: 0 })
      );
      const CounterStore2 = signalStore(
        { providedIn: 'root', protectedState: true },
        withState({ count: 0 })
      );

      const store1 = new CounterStore1();
      const state1 = getState(store1);

      const store2 = new CounterStore2();
      const state2 = getState(store2);
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'store1',
      '{ count: Signal<number>; } & StateSource<{ count: number; }>'
    );

    expectSnippet(snippet).toInfer('state1', '{ count: number; }');

    expectSnippet(`
      ${snippet}
      patchState(store1, { count: 10 });
    `).toFail();

    expectSnippet(snippet).toInfer(
      'store2',
      '{ count: Signal<number>; } & StateSource<{ count: number; }>'
    );

    expectSnippet(snippet).toInfer('state2', '{ count: number; }');

    expectSnippet(`
      ${snippet}
      patchState(store2, { count: 10 });
    `).toFail();
  });

  it('exposes writable state source when protectedState is false', () => {
    const snippet = `
      const CounterStore1 = signalStore(
        { protectedState: false },
        withState({ count: 0 })
      );
      const CounterStore2 = signalStore(
        { providedIn: 'root', protectedState: false },
        withState({ count: 0 })
      );

      const store1 = new CounterStore1();
      const state1 = getState(store1);

      const store2 = new CounterStore2();
      const state2 = getState(store2);
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'store1',
      '{ count: Signal<number>; } & WritableStateSource<{ count: number; }>'
    );

    expectSnippet(snippet).toInfer('state1', '{ count: number; }');

    expectSnippet(snippet).toInfer(
      'store2',
      '{ count: Signal<number>; } & WritableStateSource<{ count: number; }>'
    );

    expectSnippet(snippet).toInfer('state2', '{ count: number; }');

    expectSnippet(`
      ${snippet}
      patchState(store1, { count: 100 });
      patchState(store2, { count: 100 });
    `).toSucceed();
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

          patchState(
            store,
            { flags: [true] },
            (state) => ({ user: { ...state.user, age: state.user.age + 1 } }),
            { ngrx: 'store' }
          );

          return {};
        })
      );
    `).toSucceed();
  });

  it('fails when state is patched with a non-record', () => {
    expectSnippet(`
      const Store = signalStore(
        { protectedState: false },
        withState({ foo: 'bar' })
      );

      const store = new Store();
      patchState(store, 10);
    `).toFail();

    expectSnippet(`
      const Store = signalStore(
        { protectedState: false },
        withState({ foo: 'bar' })
      );

      const store = new Store();
      patchState(store, undefined);
    `).toFail();

    expectSnippet(`
      const Store = signalStore(
        { protectedState: false },
        withState({ foo: 'bar' })
      );

      const store = new Store();
      patchState(store, [1, 2, 3]);
    `).toFail();
  });

  it('fails when state is patched with a wrong record', () => {
    expectSnippet(`
      const Store = signalStore(
        { protectedState: false },
        withState({ foo: 'bar' })
      );

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
        { protectedState: false },
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
    const snippet = `
      const Store = signalStore(
        withState({ ngrx: 'rocks', x: { y: 'z' } }),
        withComputed(() => ({ signals: computed(() => [1, 2, 3]) })),
        withMethods(() => ({
          mgmt(arg: boolean): number {
            return 1;
          }
        }))
      );

      const store = inject(Store);
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'store',
      '{ ngrx: Signal<string>; x: DeepSignal<{ y: string; }>; signals: Signal<number[]>; mgmt: (arg: boolean) => number; } & StateSource<{ ngrx: string; x: { y: string; }; }>'
    );
  });

  it('allows using store via constructor-based dependency injection', () => {
    const snippet = `
      const Store = signalStore(
        withState({ foo: 10 }),
        withComputed(({ foo }) => ({ bar: computed(() => foo() + '1') })),
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
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'store',
      '{ foo: Signal<number>; bar: Signal<string>; baz: (x: number) => void; } & StateSource<{ foo: number; }>'
    );
  });

  it('correctly infers the type of methods with generics', () => {
    const snippet = `
      const Store = signalStore(
        withMethods(() => ({
          log<Str extends string>(str: Str) {
            console.log(str);
          },
        }))
      );

      const store = inject(Store);
    `;

    expectSnippet(snippet + `store.log('ngrx');`).toSucceed();
    expectSnippet(snippet + `store.log(10);`).toFail();
  });

  it('omits private store members from the public instance', () => {
    const snippet = `
      const CounterStore = signalStore(
        withState({ count1: 0, _count2: 0 }),
        withComputed(({ count1, _count2 }) => ({
          _doubleCount1: computed(() => count1() * 2),
          doubleCount2: computed(() => _count2() * 2),
        })),
        withMethods(() => ({
          increment1() {},
          _increment2() {},
        })),
        withHooks({
          onInit({ increment1, _increment2 }) {
            increment1();
            _increment2();
          },
        })
      );

      const store = new CounterStore();
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'store',
      '{ count1: Signal<number>; doubleCount2: Signal<number>; increment1: () => void; } & StateSource<{ count1: number; }>'
    );
  });

  it('prevents private state slices from being updated from the outside', () => {
    const snippet = `
      const CounterStore = signalStore(
        { protectedState: false },
        withState({ count1: 0, _count2: 0 }),
      );

      const store = new CounterStore();
    `;

    expectSnippet(`
      ${snippet}
      patchState(store, { count1: 1 });
    `).toSucceed();

    expectSnippet(`
      ${snippet}
      patchState(store, { count1: 1, _count2: 1 });
    `).toFail(/'_count2' does not exist in type/);
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
            props: type<{ sig: Signal<boolean> }>(),
          },
          withState({ y: initialY }),
          withComputed(() => ({ sigY: computed(() => 'sigY') })),
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

        function withBaz() {
          return signalStoreFeature(
            withFoo(),
            withState({ count: 0 }),
            withBar()
          );
        }

        function withBaz2() {
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

      expectSnippet(`
        ${baseSnippet}

        const Store = signalStore(
          withMethods((store) => ({
            f() {},
            g() {},
          })),
          withComputed(() => ({ sig: computed(() => false) })),
          withState({ q1: 'q1', q2: 'q2' }),
          withX(),
          withY(),
          withZ()
        );
      `).toSucceed();

      expectSnippet(`
        ${baseSnippet}

        const feature = signalStoreFeature(
          { props: type<{ sig: Signal<boolean> }>() },
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
      `).toSucceed();
    });

    it('fails when custom feature is used with wrong input', () => {
      expectSnippet(
        `${baseSnippet} const Store = signalStore(withY());`
      ).toFail();

      expectSnippet(
        `${baseSnippet} const withY2 = () => signalStoreFeature(withY());`
      ).toFail();

      expectSnippet(`
        ${baseSnippet}

        const Store = signalStore(
          withState({ q1: 1, q2: 'q2' }),
          withComputed(() => ({ sig: computed(() => false) })),
          withX(),
          withY(),
          withComputed(() => ({ q1: computed(() => 10) })),
          withMethods((store) => ({
            f() {
              patchState(store, { x: 1, y: { a: '', b: 0 }, q2: 'q2new' });
            },
          }))
        );
      `).toFail();

      expectSnippet(`
        ${baseSnippet}

        const feature = signalStoreFeature(
          { props: type<{ sig: Signal<string> }>() },
          withX(),
          withState({ q1: 'q1' }),
          withY(),
          withMethods((store) => ({
            f() {
              patchState(store, { x: 1, q1: 'xyz', y: { a: '', b: 0 } });
            },
          }))
        );
      `).toFail();

      expectSnippet(`
        ${baseSnippet}

        const Store = signalStore(
          withState({ q1: 'q1', q2: 'q2' }),
          withComputed(() => ({ sig: computed(() => false) })),
          withX(),
          withMethods((store) => ({
            f() {
              patchState(store, { q1: 'q1new', q2: 'q2new', x: 100 });
            },
            g: (str: string) => console.log(str),
          })),
          withY(),
          withZ(),
        );

        const feature = signalStoreFeature(
          {
            props: type<{ sig: Signal<boolean> }>(),
            methods: type<{ f(): void; g(arg: string): string; }>(),
          },
          withX(),
          withZ(),
          withState({ q1: 'q1' }),
          withY(),
        );
      `).toSucceed();
    });
  });

  describe('custom features with generics', () => {
    const baseSnippet = `
      function withSelectedEntity<Entity>() {
        return signalStoreFeature(
          type<{
            state: {
              entities: Entity[];
            };
          }>(),
          withState({ selectedEntity: null as Entity | null }),
          withComputed(({ selectedEntity, entities }) => ({
            selectedEntity2: computed(() =>
              selectedEntity()
                ? entities().find((e) => e === selectedEntity())
                : undefined
            ),
          }))
        );
      }

      function withLoadEntities<Entity extends { id: string }>() {
        return signalStoreFeature(
          type<{
            state: {
              entities: Entity[];
              selectedEntity: Entity | null;
            };
            props: {
              selectedEntity2: Signal<Entity | undefined>;
            };
            methods: {
              logEntity: (entity: Entity) => void;
            };
          }>(),
          withMethods(({ entities, selectedEntity, selectedEntity2, logEntity }) => {
            const e: Signal<Entity[]> = entities;
            const se: Signal<Entity | null> = selectedEntity;
            const se2: Signal<Entity | undefined> = selectedEntity2;
            const le: (entity: Entity) => void = logEntity;

            return {
              loadEntities(): Promise<Entity[]> {
                return Promise.resolve([]);
              },
            };
          })
        );
      }

      type User = {
        id: string;
        firstName: string;
        lastName: string;
      };
    `;

    it('combines custom features with generics', () => {
      const snippet = `
        ${baseSnippet}

        const Store = signalStore(
          withState({ entities: [] as User[] }),
          withSelectedEntity(),
          withMethods(() => ({
            logEntity(user: User) {
              console.log(user);
            },
          })),
          withLoadEntities()
        );

        const store = new Store();
        const selectedEntity = store.selectedEntity;
        const selectedEntity2 = store.selectedEntity2;
        const loadEntities = store.loadEntities;

        const feature = signalStoreFeature(
          {
            state: type<{
              entities: User[];
            }>(),
            methods: type<{
              logEntity: (entity: User) => void;
            }>(),
          },
          withSelectedEntity(),
          withLoadEntities()
        );
      `;

      expectSnippet(snippet).toSucceed();

      expectSnippet(snippet).toInfer('selectedEntity', 'Signal<User | null>');

      expectSnippet(snippet).toInfer(
        'selectedEntity2',
        'Signal<User | undefined>'
      );

      expectSnippet(snippet).toInfer('loadEntities', '() => Promise<User[]>');
    });

    it('fails when custom feature with generics is used with wrong input', () => {
      expectSnippet(`
        ${baseSnippet}

        const Store = signalStore(
          withState({ entities: [] as User[] }),
          withSelectedEntity(),
          withLoadEntities()
        );
      `).toFail();

      expectSnippet(`
        ${baseSnippet}

        const feature = signalStoreFeature(
          {
            state: type<{
              entities: User[];
            }>(),
            methods: type<{
              logEntity: (entity: number) => void;
            }>(),
          },
          withSelectedEntity(),
          withLoadEntities()
        );
      `).toFail();

      expectSnippet(`
        ${baseSnippet}

        const feature = signalStoreFeature(
          {
            state: type<{
              entities: User[];
            }>(),
          },
          withSelectedEntity(),
          withLoadEntities()
        );
      `).toFail();

      expectSnippet(`
        ${baseSnippet}

        const feature = signalStoreFeature(
          {
            state: type<{
              entities: boolean;
            }>(),
            methods: type<{
              logEntity: (entity: User) => void;
            }>(),
          },
          withSelectedEntity(),
          withLoadEntities()
        );
      `).toFail();
    });
  });
});
