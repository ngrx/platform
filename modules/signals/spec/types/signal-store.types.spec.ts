import { computed, inject, type Signal, type Type } from '@angular/core';
import {
  type DeepSignal,
  getState,
  patchState,
  signalStore,
  signalStoreFeature,
  type StateSource,
  type,
  withComputed,
  withHooks,
  withMethods,
  withState,
  type WritableStateSource,
} from '@ngrx/signals';
import { describe, expect, it } from 'tstyche';

describe('signalStore', () => {
  it('allows passing state as a generic argument', () => {
    type State = { foo: string; bar: number[] };
    const Store = signalStore(withState<State>({ foo: 'bar', bar: [1, 2] }));

    expect(Store).type.toBe<
      Type<
        { foo: Signal<string>; bar: Signal<number[]> } & StateSource<{
          foo: string;
          bar: number[];
        }>
      >
    >();
  });

  it('creates deep signals for nested state slices', () => {
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

    expect(store).type.toBe<
      {
        user: DeepSignal<{
          age: number;
          details: { first: string; flags: boolean[] };
        }>;
      } & StateSource<{
        user: { age: number; details: { first: string; flags: boolean[] } };
      }>
    >();
    expect(store.user).type.toBe<
      DeepSignal<{ age: number; details: { first: string; flags: boolean[] } }>
    >();
    expect(store.user.details).type.toBe<
      DeepSignal<{ first: string; flags: boolean[] }>
    >();
    expect(store.user.details.first).type.toBe<Signal<string>>();
    expect(store.user.details.flags).type.toBe<Signal<boolean[]>>();
  });

  it('does not create deep signals when state slices are unknown records', () => {
    type State = {
      foo: { [key: string]: string };
      bar: { baz: Record<number, boolean> };
      x: { y: { z: Record<string, { foo: number } | boolean> } };
    };

    const Store = signalStore(
      withState<State>({
        foo: {},
        bar: { baz: {} },
        x: { y: { z: {} } },
      })
    );

    const store = new Store();

    expect(store.foo).type.toBe<Signal<{ [key: string]: string }>>();
    expect(store.bar.baz).type.toBe<Signal<Record<number, boolean>>>();
    expect(store.x.y.z).type.toBe<
      Signal<Record<string, boolean | { foo: number }>>
    >();
  });

  it('creates deep signals when state type is an interface', () => {
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

    expect(store.user).type.toBe<DeepSignal<User>>();
    expect(store.user.firstName).type.toBe<Signal<string>>();
    expect(store.num).type.toBe<Signal<number>>();
    expect(store.map).type.toBe<Signal<Map<string, { foo: number }>>>();
    expect(store.set).type.toBe<Signal<Set<number>>>();
  });

  it('does not create deep signals when state type is an iterable', () => {
    const ArrayStore = signalStore(withState<number[]>([]));
    const arrayStore = new ArrayStore();

    const SetStore = signalStore(withState(new Set<{ foo: string }>()));
    const setStore = new SetStore();

    const MapStore = signalStore(withState(new Map<string, { foo: number }>()));
    const mapStore = new MapStore();

    const FloatArrayStore = signalStore(withState(new Float32Array()));
    const floatArrayStore = new FloatArrayStore();

    expect<
      Extract<keyof typeof arrayStore, string | number>
    >().type.toBe<never>();
    expect<
      Extract<keyof typeof setStore, string | number>
    >().type.toBe<never>();
    expect<
      Extract<keyof typeof mapStore, string | number>
    >().type.toBe<never>();
    expect<
      Extract<keyof typeof floatArrayStore, string | number>
    >().type.toBe<never>();
  });

  it('does not create deep signals when state type is a built-in object type', () => {
    const WeakMapStore = signalStore(
      withState(new WeakMap<{ foo: string }, { bar: number }>())
    );
    const weakMapStore = new WeakMapStore();

    const DateStore = signalStore(withState(new Date()));
    const dateStore = new DateStore();

    const ErrorStore = signalStore(withState(new Error()));
    const errorStore = new ErrorStore();

    const RegExpStore = signalStore(withState(new RegExp('')));
    const regExpStore = new RegExpStore();

    expect<
      Extract<keyof typeof weakMapStore, string | number>
    >().type.toBe<never>();
    expect<
      Extract<keyof typeof dateStore, string | number>
    >().type.toBe<never>();
    expect<
      Extract<keyof typeof errorStore, string | number>
    >().type.toBe<never>();
    expect<
      Extract<keyof typeof regExpStore, string | number>
    >().type.toBe<never>();
  });

  it('does not create deep signals when state type is a function', () => {
    const Store = signalStore(withState(() => () => {}));
    const store = new Store();

    expect<Extract<keyof typeof store, string | number>>().type.toBe<never>();
  });

  it('succeeds when state is an empty object', () => {
    const Store = signalStore(withState({}));

    expect(Store).type.toBe<Type<{} & StateSource<{}>>>();
  });

  it('succeeds when state slices are union types', () => {
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

    expect(store).type.toBe<
      {
        foo: Signal<number | { s: string }>;
        bar: DeepSignal<{ baz: { b: boolean } | null }>;
        x: DeepSignal<{ y: { z: number | undefined } }>;
      } & StateSource<State>
    >();
    expect(store.foo).type.toBe<Signal<number | { s: string }>>();
    expect(store.bar).type.toBe<DeepSignal<{ baz: { b: boolean } | null }>>();
    expect(store.bar.baz).type.toBe<Signal<{ b: boolean } | null>>();
    expect(store.x).type.toBe<DeepSignal<{ y: { z: number | undefined } }>>();
    expect(store.x.y).type.toBe<DeepSignal<{ z: number | undefined }>>();
    expect(store.x.y.z).type.toBe<Signal<number | undefined>>();
  });

  it('succeeds when root state slices contain Function properties', () => {
    const Store1 = signalStore(
      withState({
        name: { x: { y: 'z' } },
        arguments: [1, 2, 3],
        call: false,
      })
    );

    expect(Store1).type.toBe<
      Type<
        {
          name: DeepSignal<{ x: { y: string } }>;
          arguments: Signal<number[]>;
          call: Signal<boolean>;
        } & StateSource<{
          name: { x: { y: string } };
          arguments: number[];
          call: boolean;
        }>
      >
    >();

    const Store2 = signalStore(
      withState({
        apply: 'apply',
        bind: { foo: 'bar' },
        prototype: ['ngrx'],
      })
    );

    expect(Store2).type.toBe<
      Type<
        {
          apply: Signal<string>;
          bind: DeepSignal<{ foo: string }>;
          prototype: Signal<string[]>;
        } & StateSource<{
          apply: string;
          bind: { foo: string };
          prototype: string[];
        }>
      >
    >();

    const Store3 = signalStore(
      withState({
        length: 10,
        caller: undefined,
      })
    );

    expect(Store3).type.toBe<
      Type<
        { length: Signal<number>; caller: Signal<undefined> } & StateSource<{
          length: number;
          caller: undefined;
        }>
      >
    >();
  });

  it('succeeds when nested state slices contain Function properties', () => {
    type State = { x: { name?: string } };
    const Store1 = signalStore(withState<State>({ x: { name: '' } }));
    const store1 = new Store1();

    expect(store1.x.name).type.toBe<Signal<string | undefined> | undefined>();

    const Store2 = signalStore(
      withState({ x: { length: { name: false }, baz: 1 } })
    );
    const store2 = new Store2();

    expect(store2.x.length).type.toBe<DeepSignal<{ name: boolean }>>();
    expect(store2.x.length.name).type.toBe<Signal<boolean>>();
  });

  it('succeeds when nested state slices are optional', () => {
    type State = {
      bar: { baz?: number };
      x: { y?: { z: boolean } };
    };

    const Store = signalStore(withState<State>({ bar: {}, x: {} }));
    const store = new Store();

    expect(store).type.toBe<
      {
        bar: DeepSignal<{ baz?: number }>;
        x: DeepSignal<{ y?: { z: boolean } }>;
      } & StateSource<State>
    >();
    expect(store.bar).type.toBe<DeepSignal<{ baz?: number }>>();
    expect(store.bar.baz).type.toBe<Signal<number | undefined> | undefined>();
    expect(store.x).type.toBe<DeepSignal<{ y?: { z: boolean } }>>();
    expect(store.x.y).type.toBe<
      Signal<{ z: boolean } | undefined> | undefined
    >();
  });

  it('succeeds when root state slices are optional', () => {
    type State = {
      foo?: { s: string };
      bar: number;
    };

    const Store = signalStore(withState<State>({ foo: { s: '' }, bar: 1 }));
    const store = new Store();

    expect(store.foo).type.toBe<
      Signal<{ s: string } | undefined> | undefined
    >();
  });

  it('does not create deep signals when state is an unknown record', () => {
    const Store1 = signalStore(withState<{ [key: string]: number }>({}));
    const store1 = new Store1();

    expect<Extract<keyof typeof store1, string | number>>().type.toBe<never>();

    const Store2 = signalStore(
      withState<{ [key: number]: { bar: string } }>({})
    );
    const store2 = new Store2();

    expect<Extract<keyof typeof store2, string | number>>().type.toBe<never>();

    const Store3 = signalStore(
      withState<Record<string, { foo: boolean } | number>>({
        x: { foo: true },
        y: 1,
      })
    );
    const store3 = new Store3();

    expect<Extract<keyof typeof store3, string | number>>().type.toBe<never>();
  });

  it('fails when state is not an object', () => {
    expect(withState).type.not.toBeCallableWith(10);
    expect(withState).type.not.toBeCallableWith('');
    expect(withState).type.not.toBeCallableWith(null);
    expect(withState).type.not.toBeCallableWith(true);
  });

  it('exposes readonly state source when protectedState is not provided', () => {
    const CounterStore1 = signalStore(withState({ count: 0 }));
    const CounterStore2 = signalStore(
      { providedIn: 'root' },
      withState({ count: 0 })
    );

    const store1 = new CounterStore1();
    const state1 = getState(store1);

    const store2 = new CounterStore2();
    const state2 = getState(store2);

    expect(store1).type.toBe<
      { count: Signal<number> } & StateSource<{ count: number }>
    >();
    expect(state1).type.toBe<{ count: number }>();
    expect(store2).type.toBe<
      { count: Signal<number> } & StateSource<{ count: number }>
    >();
    expect(state2).type.toBe<{ count: number }>();

    expect(patchState).type.not.toBeCallableWith(store1, { count: 1 });
    expect(patchState).type.not.toBeCallableWith(store2, { count: 1 });
  });

  it('exposes readonly state source when protectedState is true', () => {
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

    expect(store1).type.toBe<
      { count: Signal<number> } & StateSource<{ count: number }>
    >();
    expect(state1).type.toBe<{ count: number }>();
    expect(store2).type.toBe<
      { count: Signal<number> } & StateSource<{ count: number }>
    >();
    expect(state2).type.toBe<{ count: number }>();

    expect(patchState).type.not.toBeCallableWith(store1, { count: 10 });
    expect(patchState).type.not.toBeCallableWith(store2, { count: 10 });
  });

  it('exposes writable state source when protectedState is false', () => {
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

    expect(store1).type.toBe<
      { count: Signal<number> } & WritableStateSource<{ count: number }>
    >();
    expect(state1).type.toBe<{ count: number }>();
    expect(store2).type.toBe<
      { count: Signal<number> } & WritableStateSource<{ count: number }>
    >();
    expect(state2).type.toBe<{ count: number }>();

    patchState(store1, { count: 100 });
    patchState(store2, { count: 100 });
  });

  it('patches state via sequence of partial state objects and updater functions', () => {
    signalStore(
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
        patchState(store, { ngrx: 'rocks' }, (state) => ({
          flags: [...state.flags, true],
        }));

        patchState(
          store,
          { flags: [true] },
          (state) => ({ user: { ...state.user, age: state.user.age + 1 } }),
          { ngrx: 'store' }
        );

        return {};
      })
    );
  });

  it('fails when state is patched with a non-record', () => {
    const Store = signalStore(
      { protectedState: false },
      withState({ foo: 'bar' })
    );

    expect(patchState).type.not.toBeCallableWith(new Store(), 10);
    expect(patchState).type.not.toBeCallableWith(new Store(), undefined);
    expect(patchState).type.not.toBeCallableWith(new Store(), [1, 2, 3]);
  });

  it('fails when state is patched with a wrong record', () => {
    const Store1 = signalStore(
      { protectedState: false },
      withState({ foo: 'bar' })
    );

    expect(patchState).type.not.toBeCallableWith(new Store1(), { foo: 10 });

    signalStore(
      withState({ foo: 'bar' }),
      withMethods((store) => {
        patchState(store, {
          // @ts-expect-error Type 'number' is not assignable to type 'string'
          foo: 10,
        });
        return {};
      })
    );

    signalStore(
      withState({ foo: 'bar' }),
      withMethods(({ foo, ...store }) => {
        patchState(store, {
          // @ts-expect-error Type 'number' is not assignable to type 'string'
          foo: 10,
        });
        return {};
      })
    );
  });

  it('fails when state is patched with a wrong updater function', () => {
    const Store = signalStore(
      { protectedState: false },
      withState({ user: { first: 'John', age: 20 } })
    );

    const store = new Store();
    // @ts-expect-error Type 'string' is not assignable to type 'number'
    patchState(store, (state) => ({ user: { ...state.user, age: '30' } }));

    signalStore(
      withState({ user: { first: 'John', age: 20 } }),
      withMethods((store) => {
        // @ts-expect-error Type 'string' is not assignable to type 'number'
        patchState(store, (state) => ({ user: { ...state.user, age: '30' } }));
        return {};
      })
    );

    signalStore(
      withState({ user: { first: 'John', age: 20 } }),
      withMethods(({ user, ...store }) => {
        // @ts-expect-error Type 'number' is not assignable to type 'string'
        patchState(store, (state) => ({ user: { ...state.user, first: 10 } }));
        return {};
      })
    );
  });

  it('allows injecting store using the `inject` function', () => {
    const Store = signalStore(
      withState({ ngrx: 'rocks', x: { y: 'z' } }),
      withComputed(() => ({ signals: computed(() => [1, 2, 3]) })),
      withMethods(() => ({
        mgmt(arg: boolean): number {
          return 1;
        },
      }))
    );

    const store = inject(Store);

    expect(store).type.toBe<
      {
        ngrx: Signal<string>;
        x: DeepSignal<{ y: string }>;
        signals: Signal<number[]>;
        mgmt: (arg: boolean) => number;
      } & StateSource<{ ngrx: string; x: { y: string } }>
    >();
  });

  it('allows using store via constructor-based dependency injection', () => {
    const Store = signalStore(
      withState({ foo: 10 }),
      withComputed(({ foo }) => ({ bar: computed(() => foo() + '1') })),
      withMethods(() => ({
        baz(x: number): void {},
      }))
    );

    class Component {
      constructor(readonly store: InstanceType<typeof Store>) {}
    }

    const component = new Component(new Store());

    expect(component.store).type.toBe<
      {
        foo: Signal<number>;
        bar: Signal<string>;
        baz: (x: number) => void;
      } & StateSource<{ foo: number }>
    >();
  });

  it('correctly infers the type of methods with generics', () => {
    const Store = signalStore(
      withMethods(() => ({
        log<Str extends string>(str: Str) {
          console.log(str);
        },
      }))
    );

    const store = inject(Store);

    expect(store.log).type.toBeCallableWith('ngrx');
    expect(store.log).type.not.toBeCallableWith(10);
  });

  it('omits private store members from the public instance', () => {
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

    expect(store).type.toBe<
      {
        count1: Signal<number>;
        doubleCount2: Signal<number>;
        increment1: () => void;
      } & StateSource<{ count1: number }>
    >();
  });

  it('prevents private state slices from being updated from the outside', () => {
    const CounterStore = signalStore(
      { protectedState: false },
      withState({ count1: 0, _count2: 0 })
    );

    const store = new CounterStore();

    expect(patchState).type.toBeCallableWith(store, { count1: 1 });
    expect(patchState).type.not.toBeCallableWith(store, {
      count1: 1,
      _count2: 1,
    });
  });

  describe('custom features', () => {
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
          },
        }))
      );
    }

    it('combines custom features', () => {
      function withFoo() {
        return withState({ foo: 'foo' });
      }

      function withBar() {
        return signalStoreFeature(
          { state: type<{ foo: string }>() },
          withState({ bar: 'bar' })
        );
      }

      signalStoreFeature(withFoo(), withState({ count: 0 }), withBar());

      signalStoreFeature(
        withState({ foo: 'foo' }),
        withState({ count: 0 }),
        withBar()
      );

      signalStore(withFoo(), withState({ count: 0 }), withBar());

      signalStore(
        withState({ foo: 'foo' }),
        withState({ count: 0 }),
        withBar()
      );

      signalStore(
        withMethods(() => ({
          f() {},
          g() {},
        })),
        withComputed(() => ({ sig: computed(() => false) })),
        withState({ q1: 'q1', q2: 'q2' }),
        withX(),
        withY(),
        withZ()
      );

      signalStoreFeature(
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
    });

    it('fails when custom feature is used with wrong input', () => {
      expect(signalStore).type.not.toBeCallableWith(withY());
      expect(signalStoreFeature).type.not.toBeCallableWith(withY());

      // @ts-expect-error No overload matches this call
      signalStore(
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

      // @ts-expect-error No overload matches this call
      signalStoreFeature(
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

      signalStore(
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
        withZ()
      );

      signalStoreFeature(
        {
          props: type<{ sig: Signal<boolean> }>(),
          methods: type<{ f(): void; g(arg: string): string }>(),
        },
        withX(),
        withZ(),
        withState({ q1: 'q1' }),
        withY()
      );
    });
  });

  describe('custom features with generics', () => {
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
        withMethods(
          ({ entities, selectedEntity, selectedEntity2, logEntity }) => {
            const e: Signal<Entity[]> = entities;
            const se: Signal<Entity | null> = selectedEntity;
            const se2: Signal<Entity | undefined> = selectedEntity2;
            const le: (entity: Entity) => void = logEntity;

            return {
              loadEntities(): Promise<Entity[]> {
                return Promise.resolve([]);
              },
            };
          }
        )
      );
    }

    type User = {
      id: string;
      firstName: string;
      lastName: string;
    };

    it('combines custom features with generics', () => {
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

      signalStoreFeature(
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

      expect(store.selectedEntity).type.toBe<Signal<User | null>>();
      expect(store.selectedEntity2).type.toBe<Signal<User | undefined>>();
      expect(store.loadEntities).type.toBe<() => Promise<User[]>>();
    });

    it('fails when custom feature with generics is used with wrong input', () => {
      // @ts-expect-error No overload matches this call
      signalStore(
        withState({ entities: [] as User[] }),
        withSelectedEntity(),
        withLoadEntities()
      );

      // @ts-expect-error No overload matches this call
      signalStoreFeature(
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

      // @ts-expect-error No overload matches this call
      signalStoreFeature(
        {
          state: type<{
            entities: User[];
          }>(),
        },
        withSelectedEntity(),
        withLoadEntities()
      );

      // @ts-expect-error No overload matches this call
      signalStoreFeature(
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
    });
  });
});
