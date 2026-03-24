import { expectTypeOf } from 'vitest';
import { computed, Signal, Type } from '@angular/core';
import {
  DeepSignal,
  patchState,
  signalStore,
  signalStoreFeature,
  StateSource,
  type,
  withComputed,
  withHooks,
  withMethods,
  withState,
  WritableStateSource,
} from '@ngrx/signals';

describe('signalStore', () => {
  it('allows passing state as a generic argument', () => {
    type State = { foo: string; bar: number[] };
    const Store = signalStore(withState<State>({ foo: 'bar', bar: [1, 2] }));

    expectTypeOf(Store).toEqualTypeOf<
      Type<{ foo: Signal<string>; bar: Signal<number[]> } & StateSource<State>>
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

    type S = InstanceType<typeof Store>;
    expectTypeOf<S>().toEqualTypeOf<
      {
        user: DeepSignal<{
          age: number;
          details: { first: string; flags: boolean[] };
        }>;
      } & StateSource<{
        user: { age: number; details: { first: string; flags: boolean[] } };
      }>
    >();
    expectTypeOf<S['user']>().toEqualTypeOf<
      DeepSignal<{ age: number; details: { first: string; flags: boolean[] } }>
    >();
    expectTypeOf<S['user']['details']>().toEqualTypeOf<
      DeepSignal<{ first: string; flags: boolean[] }>
    >();
    expectTypeOf<S['user']['details']['first']>().toEqualTypeOf<
      Signal<string>
    >();
    expectTypeOf<S['user']['details']['flags']>().toEqualTypeOf<
      Signal<boolean[]>
    >();
  });

  it('does not create deep signals when state slices are unknown records', () => {
    type State = {
      foo: { [key: string]: string };
      bar: { baz: Record<number, boolean> };
      x: { y: { z: Record<string, { foo: number } | boolean> } };
    };

    const Store = signalStore(
      withState<State>({ foo: {}, bar: { baz: {} }, x: { y: { z: {} } } })
    );

    type S = InstanceType<typeof Store>;
    expectTypeOf<S['foo']>().toEqualTypeOf<Signal<{ [key: string]: string }>>();
    expectTypeOf<S['bar']['baz']>().toEqualTypeOf<
      Signal<Record<number, boolean>>
    >();
    expectTypeOf<S['x']['y']['z']>().toEqualTypeOf<
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

    type S = InstanceType<typeof Store>;
    expectTypeOf<S['user']>().toEqualTypeOf<DeepSignal<User>>();
    expectTypeOf<S['user']['firstName']>().toEqualTypeOf<Signal<string>>();
    expectTypeOf<S['num']>().toEqualTypeOf<Signal<number>>();
    expectTypeOf<S['map']>().toEqualTypeOf<
      Signal<Map<string, { foo: number }>>
    >();
    expectTypeOf<S['set']>().toEqualTypeOf<Signal<Set<number>>>();
  });

  it('does not create deep signals when state type is an iterable', () => {
    const ArrayStore = signalStore(withState<number[]>([]));
    const arrayStore = null! as InstanceType<typeof ArrayStore>;

    const SetStore = signalStore(withState(new Set<{ foo: string }>()));
    const setStore = null! as InstanceType<typeof SetStore>;

    const MapStore = signalStore(withState(new Map<string, { foo: number }>()));
    const mapStore = null! as InstanceType<typeof MapStore>;

    const FloatArrayStore = signalStore(withState(new Float32Array()));
    const floatArrayStore = null! as InstanceType<typeof FloatArrayStore>;

    expectTypeOf<string & keyof typeof arrayStore>().toBeNever();
    expectTypeOf<string & keyof typeof setStore>().toBeNever();
    expectTypeOf<string & keyof typeof mapStore>().toBeNever();
    expectTypeOf<string & keyof typeof floatArrayStore>().toBeNever();
  });

  it('does not create deep signals when state type is a built-in object type', () => {
    const WeakMapStore = signalStore(
      withState(new WeakMap<{ foo: string }, { bar: number }>())
    );
    const weakMapStore = null! as InstanceType<typeof WeakMapStore>;

    const DateStore = signalStore(withState(new Date()));
    const dateStore = null! as InstanceType<typeof DateStore>;

    const ErrorStore = signalStore(withState(new Error()));
    const errorStore = null! as InstanceType<typeof ErrorStore>;

    const RegExpStore = signalStore(withState(new RegExp('')));
    const regExpStore = null! as InstanceType<typeof RegExpStore>;

    expectTypeOf<string & keyof typeof weakMapStore>().toBeNever();
    expectTypeOf<string & keyof typeof dateStore>().toBeNever();
    expectTypeOf<string & keyof typeof errorStore>().toBeNever();
    expectTypeOf<string & keyof typeof regExpStore>().toBeNever();
  });

  it('does not create deep signals when state type is a function', () => {
    const Store = signalStore(withState(() => () => {}));
    const store = null! as InstanceType<typeof Store>;

    expectTypeOf<string & keyof typeof store>().toBeNever();
  });

  it('succeeds when state is an empty object', () => {
    const Store = signalStore(withState({}));

    expectTypeOf(Store).toEqualTypeOf<Type<{} & StateSource<{}>>>();
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
    type S = InstanceType<typeof Store>;
    expectTypeOf<S>().toEqualTypeOf<
      {
        foo: Signal<number | { s: string }>;
        bar: DeepSignal<{ baz: { b: boolean } | null }>;
        x: DeepSignal<{ y: { z: number | undefined } }>;
      } & StateSource<State>
    >();
    expectTypeOf<S['foo']>().toEqualTypeOf<Signal<number | { s: string }>>();
    expectTypeOf<S['bar']>().toEqualTypeOf<
      DeepSignal<{ baz: { b: boolean } | null }>
    >();
    expectTypeOf<S['bar']['baz']>().toEqualTypeOf<
      Signal<{ b: boolean } | null>
    >();
    expectTypeOf<S['x']>().toEqualTypeOf<
      DeepSignal<{ y: { z: number | undefined } }>
    >();
    expectTypeOf<S['x']['y']>().toEqualTypeOf<
      DeepSignal<{ z: number | undefined }>
    >();
    expectTypeOf<S['x']['y']['z']>().toEqualTypeOf<
      Signal<number | undefined>
    >();
  });

  it('succeeds when root state slices contain Function properties', () => {
    const Store1 = signalStore(
      withState({ name: { x: { y: 'z' } }, arguments: [1, 2, 3], call: false })
    );
    expectTypeOf(Store1).toEqualTypeOf<
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
      withState({ apply: 'apply', bind: { foo: 'bar' }, prototype: ['ngrx'] })
    );
    expectTypeOf(Store2).toEqualTypeOf<
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

    const Store3 = signalStore(withState({ length: 10, caller: undefined }));
    expectTypeOf(Store3).toEqualTypeOf<
      Type<
        { length: Signal<number>; caller: Signal<undefined> } & StateSource<{
          length: number;
          caller: undefined;
        }>
      >
    >();
  });

  it('succeeds when nested state slices contain Function properties', () => {
    type State1 = { x: { name?: string } };
    const Store1 = signalStore(withState<State1>({ x: { name: '' } }));
    type S1 = InstanceType<typeof Store1>;
    expectTypeOf<S1['x']['name']>().toEqualTypeOf<
      Signal<string | undefined> | undefined
    >();

    const Store2 = signalStore(
      withState({ x: { length: { name: false }, baz: 1 } })
    );
    type S2 = InstanceType<typeof Store2>;
    expectTypeOf<S2['x']['length']>().toEqualTypeOf<
      DeepSignal<{ name: boolean }>
    >();
    expectTypeOf<S2['x']['length']['name']>().toEqualTypeOf<Signal<boolean>>();
  });

  it('succeeds when nested state slices are optional', () => {
    type State = {
      bar: { baz?: number };
      x: { y?: { z: boolean } };
    };

    const Store = signalStore(withState<State>({ bar: {}, x: {} }));
    type S = InstanceType<typeof Store>;
    expectTypeOf<S>().toEqualTypeOf<
      {
        bar: DeepSignal<{ baz?: number | undefined }>;
        x: DeepSignal<{ y?: { z: boolean } | undefined }>;
      } & StateSource<State>
    >();
    expectTypeOf<S['bar']>().toEqualTypeOf<
      DeepSignal<{ baz?: number | undefined }>
    >();
    expectTypeOf<S['bar']['baz']>().toEqualTypeOf<
      Signal<number | undefined> | undefined
    >();
    expectTypeOf<S['x']>().toEqualTypeOf<
      DeepSignal<{ y?: { z: boolean } | undefined }>
    >();
    expectTypeOf<S['x']['y']>().toEqualTypeOf<
      Signal<{ z: boolean } | undefined> | undefined
    >();
  });

  it('succeeds when root state slices are optional', () => {
    type State = { foo?: { s: string }; bar: number };
    const Store = signalStore(withState<State>({ foo: { s: '' }, bar: 1 }));
    type S = InstanceType<typeof Store>;
    expectTypeOf<S['foo']>().toEqualTypeOf<
      Signal<{ s: string } | undefined> | undefined
    >();
  });

  it('does not create deep signals when state is an unknown record', () => {
    const Store1 = signalStore(withState<{ [key: string]: number }>({}));
    const store1 = null! as InstanceType<typeof Store1>;
    expectTypeOf<string & keyof typeof store1>().toBeNever();

    const Store2 = signalStore(
      withState<{ [key: number]: { bar: string } }>({})
    );
    const store2 = null! as InstanceType<typeof Store2>;
    expectTypeOf<string & keyof typeof store2>().toBeNever();

    const Store3 = signalStore(
      withState<Record<string, { foo: boolean } | number>>({
        x: { foo: true },
        y: 1,
      })
    );
    const store3 = null! as InstanceType<typeof Store3>;
    expectTypeOf<string & keyof typeof store3>().toBeNever();
  });

  it('fails when state is not an object', () => {
    // @ts-expect-error
    signalStore(withState(10));
    // @ts-expect-error
    signalStore(withState(''));
    // @ts-expect-error
    signalStore(withState(null));
    // @ts-expect-error
    signalStore(withState(true));
  });

  it('exposes readonly state source when protectedState is not provided', () => {
    const CounterStore1 = signalStore(withState({ count: 0 }));
    const CounterStore2 = signalStore(
      { providedIn: 'root' },
      withState({ count: 0 })
    );

    type S1 = InstanceType<typeof CounterStore1>;
    type S2 = InstanceType<typeof CounterStore2>;
    expectTypeOf<S1>().toEqualTypeOf<
      { count: Signal<number> } & StateSource<{ count: number }>
    >();
    expectTypeOf<
      S1 extends StateSource<infer St> ? St : never
    >().toEqualTypeOf<{ count: number }>();
    expectTypeOf<S2>().toEqualTypeOf<
      { count: Signal<number> } & StateSource<{ count: number }>
    >();
    expectTypeOf<
      S2 extends StateSource<infer St> ? St : never
    >().toEqualTypeOf<{ count: number }>();
    void ((store1: S1, store2: S2) => {
      // @ts-expect-error - readonly state source cannot be patched from outside
      patchState(store1, { count: 1 });
      // @ts-expect-error - readonly state source cannot be patched from outside
      patchState(store2, { count: 1 });
    });
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

    type S1 = InstanceType<typeof CounterStore1>;
    type S2 = InstanceType<typeof CounterStore2>;
    expectTypeOf<S1>().toEqualTypeOf<
      { count: Signal<number> } & StateSource<{ count: number }>
    >();
    expectTypeOf<
      S1 extends StateSource<infer St> ? St : never
    >().toEqualTypeOf<{ count: number }>();
    expectTypeOf<S2>().toEqualTypeOf<
      { count: Signal<number> } & StateSource<{ count: number }>
    >();
    expectTypeOf<
      S2 extends StateSource<infer St> ? St : never
    >().toEqualTypeOf<{ count: number }>();
    void ((store1: S1, store2: S2) => {
      // @ts-expect-error - readonly state source cannot be patched from outside
      patchState(store1, { count: 10 });
      // @ts-expect-error - readonly state source cannot be patched from outside
      patchState(store2, { count: 10 });
    });
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

    type S1 = InstanceType<typeof CounterStore1>;
    type S2 = InstanceType<typeof CounterStore2>;
    expectTypeOf<S1>().toEqualTypeOf<
      { count: Signal<number> } & WritableStateSource<{ count: number }>
    >();
    expectTypeOf<
      S1 extends StateSource<infer St> ? St : never
    >().toEqualTypeOf<{ count: number }>();
    expectTypeOf<S2>().toEqualTypeOf<
      { count: Signal<number> } & WritableStateSource<{ count: number }>
    >();
    expectTypeOf<
      S2 extends StateSource<infer St> ? St : never
    >().toEqualTypeOf<{ count: number }>();
    void ((store1: S1, store2: S2) => {
      patchState(store1, { count: 100 });
      patchState(store2, { count: 100 });
    });
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
    type S = InstanceType<typeof Store>;
    void ((store: S) => {
      // @ts-expect-error
      patchState(store, 10);
      // @ts-expect-error
      patchState(store, undefined);
      // @ts-expect-error
      patchState(store, [1, 2, 3]);
    });
  });

  it('fails when state is patched with a wrong record', () => {
    {
      const Store = signalStore(
        { protectedState: false },
        withState({ foo: 'bar' })
      );
      type S = InstanceType<typeof Store>;
      void ((store: S) => {
        // @ts-expect-error - Type 'number' is not assignable to type 'string'
        patchState(store, { foo: 10 });
      });
    }
    {
      signalStore(
        withState({ foo: 'bar' }),
        withMethods((store) => {
          // @ts-expect-error - Type 'number' is not assignable to type 'string'
          patchState(store, { foo: 10 });
          return {};
        })
      );
    }
    {
      signalStore(
        withState({ foo: 'bar' }),
        withMethods(({ foo, ...store }) => {
          // @ts-expect-error - Type 'number' is not assignable to type 'string'
          patchState(store, { foo: 10 });
          return {};
        })
      );
    }
  });

  it('fails when state is patched with a wrong updater function', () => {
    {
      const Store = signalStore(
        { protectedState: false },
        withState({ user: { first: 'John', age: 20 } })
      );
      type S = InstanceType<typeof Store>;
      void ((store: S) => {
        // @ts-expect-error - Type 'string' is not assignable to type 'number'
        patchState(store, (state) => ({ user: { ...state.user, age: '30' } }));
      });
    }
    {
      signalStore(
        withState({ user: { first: 'John', age: 20 } }),
        withMethods((store) => {
          // @ts-expect-error - Type 'string' is not assignable to type 'number'
          patchState(store, (state) => ({
            user: { ...state.user, age: '30' },
          }));
          return {};
        })
      );
    }
    {
      signalStore(
        withState({ user: { first: 'John', age: 20 } }),
        withMethods(({ user, ...store }) => {
          // @ts-expect-error - Type 'number' is not assignable to type 'string'
          patchState(store, (state) => ({
            user: { ...state.user, first: 10 },
          }));
          return {};
        })
      );
    }
  });

  it('allows injecting store using the `inject` function', () => {
    const Store = signalStore(
      withState({ ngrx: 'rocks', x: { y: 'z' } }),
      withComputed(() => ({ signals: computed(() => [1, 2, 3]) })),
      withMethods(() => ({
        mgmt(_arg: boolean): number {
          return 1;
        },
      }))
    );

    const store = null! as InstanceType<typeof Store>;

    expectTypeOf(store).toEqualTypeOf<
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
        baz(_x: number): void {},
      }))
    );

    type StoreInstance = InstanceType<typeof Store>;
    const store = null! as StoreInstance;

    expectTypeOf(store).toEqualTypeOf<
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

    type S = InstanceType<typeof Store>;
    void ((store: S) => {
      store.log('ngrx');
      // @ts-expect-error - number is not assignable to string
      store.log(10);
    });
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

    const store = null! as InstanceType<typeof CounterStore>;

    expectTypeOf(store).toEqualTypeOf<
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
    type S = InstanceType<typeof CounterStore>;
    void ((store: S) => {
      patchState(store, { count1: 1 });
      // @ts-expect-error - '_count2' does not exist in type
      patchState(store, { count1: 1, _count2: 1 });
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
      {
        function withFoo() {
          return withState({ foo: 'foo' });
        }

        function withBar() {
          return signalStoreFeature(
            { state: type<{ foo: string }>() },
            withState({ bar: 'bar' })
          );
        }

        signalStore(withFoo(), withState({ count: 0 }), withBar());
        signalStore(
          withState({ foo: 'foo' }),
          withState({ count: 0 }),
          withBar()
        );
      }

      signalStore(
        withMethods((_store) => ({ f() {}, g() {} })),
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
      {
        // @ts-expect-error - withY requires state: { q1: string } and props: { sig: Signal<boolean> }
        signalStore(withY());
      }
      {
        // @ts-expect-error - withY requires state: { q1: string } and props: { sig: Signal<boolean> }
        signalStoreFeature(withY());
      }
      {
        // @ts-expect-error - q1 type mismatch: number vs string required by withY
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
      }
      {
        // @ts-expect-error - sig type mismatch: Signal<string> vs Signal<boolean> required by withY
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
      }
      // The following combination succeeds: correct q1 type, sig type, and all required methods
      {
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
      }
    });
  });

  describe('custom features with generics', () => {
    function withSelectedEntity<Entity>() {
      return signalStoreFeature(
        type<{ state: { entities: Entity[] } }>(),
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
          state: { entities: Entity[]; selectedEntity: Entity | null };
          props: { selectedEntity2: Signal<Entity | undefined> };
          methods: { logEntity: (entity: Entity) => void };
        }>(),
        withMethods(() => ({
          loadEntities(): Promise<Entity[]> {
            return Promise.resolve([]);
          },
        }))
      );
    }

    type User = { id: string; firstName: string; lastName: string };

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

      type S = InstanceType<typeof Store>;
      expectTypeOf<S['selectedEntity']>().toEqualTypeOf<Signal<User | null>>();
      expectTypeOf<S['selectedEntity2']>().toEqualTypeOf<
        Signal<User | undefined>
      >();
      expectTypeOf<S['loadEntities']>().toEqualTypeOf<() => Promise<User[]>>();

      signalStoreFeature(
        {
          state: type<{ entities: User[] }>(),
          methods: type<{ logEntity: (entity: User) => void }>(),
        },
        withSelectedEntity(),
        withLoadEntities()
      );
    });

    it('fails when custom feature with generics is used with wrong input', () => {
      {
        // @ts-expect-error - missing logEntity method
        signalStore(
          withState({ entities: [] as User[] }),
          withSelectedEntity(),
          withLoadEntities()
        );
      }
      {
        // @ts-expect-error - logEntity expects User, not number
        signalStoreFeature(
          {
            state: type<{ entities: User[] }>(),
            methods: type<{ logEntity: (entity: number) => void }>(),
          },
          withSelectedEntity(),
          withLoadEntities()
        );
      }
      {
        // @ts-expect-error - missing logEntity method in feature
        signalStoreFeature(
          { state: type<{ entities: User[] }>() },
          withSelectedEntity(),
          withLoadEntities()
        );
      }
      {
        // @ts-expect-error - entities type mismatch: boolean vs User[]
        signalStoreFeature(
          {
            state: type<{ entities: boolean }>(),
            methods: type<{ logEntity: (entity: User) => void }>(),
          },
          withSelectedEntity(),
          withLoadEntities()
        );
      }
    });
  });
});
