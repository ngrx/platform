import { computed, Signal } from '@angular/core';
import {
  ExposableProperty,
  ExposedState,
  ExposedStore,
} from './exposed.models';
import { withComputed, withMethods, withState } from '@ngrx/signals';
import { signalStore } from './exposed-store';
import { DeepSignal } from '../deep-signal';

type AreEqual<A, B> = A extends B ? (B extends A ? true : false) : false;
type Assert<Condition extends true> = Condition;
type Not<Value extends boolean> = Value extends true ? false : true;
type BiExclude<T, U> = Exclude<T, U> | Exclude<U, T>;

type Store = {
  state: {
    id: number;
    firstname: string;
    surname: string;
    birthday: string;
  };
  methods: {
    load(id: number): void;
  };
  signals: {
    prettyName: Signal<string>;
    age: Signal<number>;
  };
};

describe('Store with Encapsulation', () => {
  describe('Exposed Types', () => {
    test('Basics', () => {
      type _T0 = Assert<AreEqual<true, true>>;
    });
    test('Exposable type', () => {
      type _T1 = Assert<
        BiExclude<
          | 'prettyName'
          | 'age'
          | 'load'
          | 'id'
          | 'firstname'
          | 'surname'
          | 'birthday'
          | 'all',
          ExposableProperty<Store>
        > extends never
          ? true
          : false
      >;
    });

    describe('ExposedStore', () => {
      test('exposed method', () => {
        type _T = Assert<
          AreEqual<
            { load: (id: number) => void },
            ExposedStore<Store, ['load']>
          >
        >;
      });
      test('exposed method and computed', () => {
        type _T = Assert<
          AreEqual<
            { load: (id: number) => void; age: Signal<number> },
            ExposedStore<Store, ['load', 'age']>
          >
        >;
      });
      test('exposed with state', () => {
        type _T = Assert<
          AreEqual<{ age: Signal<number> }, ExposedStore<Store, ['id', 'age']>>
        >;
      });
      test('exposed with only state properties', () => {
        type _T = Assert<AreEqual<{}, ExposedStore<Store, ['id', 'surname']>>>;
      });

      test('state properties should not be of type never', () => {
        type _T1 = Assert<
          // @ts-expect-error id does not exist
          AreEqual<
            { age: Signal<number>; id: never },
            ExposedStore<Store, ['id', 'age']>
          >
        >;

        type _T2 = Assert<
          // @ts-expect-error id does not exist
          AreEqual<
            { age: Signal<number>; id: undefined },
            ExposedStore<Store, ['id', 'age']>
          >
        >;
      });
    });

    describe('ExposedState', () => {
      test('exposed state', () => {
        type _T6 = Assert<
          AreEqual<
            { id: number; surname: string },
            ExposedState<Store, ['id', 'surname']>
          >
        >;
      });
    });
  });

  describe('exposed property in state', () => {
    const setup = (
      expose: Array<
        | 'id'
        | 'firstname'
        | 'surname'
        | 'birthday'
        | 'prettyName'
        | 'age'
        | 'all'
      >
    ) =>
      signalStore(
        { providedIn: 'root', expose },
        withState({
          id: 1,
          firstname: 'John',
          surname: 'List',
          birthday: new Date(1987, 5, 12),
        }),
        withMethods(() => {
          return { load: (id: number) => void true };
        }),
        withComputed((state) => {
          return {
            prettyName: computed(() => `${state.firstname} ${state.surname}`),
            age: computed(
              () =>
                (new Date().getTime() - state.birthday().getTime()) /
                (1_000 * 60 * 60 * 24 * 365)
            ),
          };
        })
      );

    it('should expose everything', () => {
      const Store = signalStore(
        { providedIn: 'root', expose: ['id', 'load', 'prettyName', 'age'] },
        withState({
          id: 1,
          firstname: 'John',
          surname: 'List',
          birthday: new Date(1987, 5, 12),
        }),
        withComputed((state) => {
          return {
            prettyName: computed(() => `${state.firstname} ${state.surname}`),
            age: computed(
              () =>
                (new Date().getTime() - state.birthday().getTime()) /
                (1_000 * 60 * 60 * 24 * 365)
            ),
          };
        }),
        withMethods(() => {
          return { load: (id: number) => void true };
        })
      );
      type Store = InstanceType<typeof Store>;
      type Contains<Store, Properties> = Store extends Properties
        ? true
        : false;

      type Keys = keyof Store;
      type Id = Store['id'];

      type T = Assert<
        Contains<
          Store,
          {
            id: DeepSignal<number>;
            prettyName: Signal<string>;
            age: Signal<number>;
            load: (id: number) => void;
          }
        >
      >;
    });

    it('should expose everything', () => {
      const StoreClass = setup(['prettyName']);
      type Store = InstanceType<typeof StoreClass>;
      type Contains<Store, Properties> = Store extends Properties
        ? true
        : false;

      type T1 = Assert<Contains<Store, { prettyName: Signal<string> }>>;
      type T2 = Assert<Not<Contains<Store, { id: Signal<number> }>>>;
    });
  });
});

const Store = signalStore(
  { providedIn: 'root', expose: ['age', 'load'] },
  withState({
    id: 1,
    firstname: 'John',
    surname: 'List',
    birthday: new Date(1987, 5, 12),
  }),
  withComputed((state) => {
    return {
      prettyName: computed(() => `${state.firstname} ${state.surname}`),
      age: computed(
        () =>
          (new Date().getTime() - state.birthday().getTime()) /
          (1_000 * 60 * 60 * 24 * 365)
      ),
    };
  }),
  withMethods(() => {
    return { load: (id: number) => void true };
  })
);

const store = new Store();
const age = store.age;
