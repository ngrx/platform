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

describe('nothing encapsulated', () => {
  it('should have all properties', () => {
    type T = Assert<
      Extends<
        InstanceType<typeof Store>,
        {
          id: Signal<number>;
          firstname: Signal<string>;
          surname: Signal<string>;
          birthday: Signal<Date>;
          load: (id: number) => void;
          prettyName: Signal<string>;
          age: Signal<number>;
        }
      >
    >;
  });
  it('should be able to patch the complete state', () => {
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
