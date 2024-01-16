import {
  patchState,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, Signal } from '@angular/core';
import { signalStore } from '../encapsulated.store';
import { Assert, Extends } from './test-utils';

const Store = signalStore(
  {
    providedIn: 'root',
    private: ['id', 'load', 'age'],
  },
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

describe('private for id (state), load (method), age (computed)', () => {
  it('should miss id, load, age', () => {
    type T1 = Assert<
      Extends<
        InstanceType<typeof Store>,
        {
          firstname: Signal<string>;
          surname: Signal<string>;
          birthday: Signal<Date>;
          prettyName: Signal<string>;
        }
      >
    >;

    const store = new Store();

    // @ts-expect-error id does not exist
    store.id;

    // @ts-expect-error load does not exist
    store.load;

    // @ts-expect-error age does not exist
    store.age;
  });

  it('should be able to patch everything', () => {
    const store = new Store();
    patchState(store, {
      id: 1,
      firstname: 'Rudolf',
      surname: 'Meier',
      birthday: new Date(1999, 2, 1),
    });
  });

  it('should be able to patch the complete state via the update fn', () => {
    const store = new Store();
    patchState(store, (value) => ({
      id: value.id,
      firstname: value.firstname,
      surname: value.surname,
      birthday: value.birthday,
    }));
  });
});
