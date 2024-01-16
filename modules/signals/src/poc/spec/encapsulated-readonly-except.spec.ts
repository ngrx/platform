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
    readonlyExcept: ['firstname', 'surname'],
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

describe('readonly except firstname and surname', () => {
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

  it('should not be able to patch except firstname and surname', () => {
    const store = new Store();

    patchState(store, { firstname: 'Rudolf', surname: 'Meier' });

    // @ts-expect-error not patchable
    patchState(store, { id: 1 });
    // @ts-expect-error not patchable
    patchState(store, { birthday: new Date(1999, 1, 1) });
  });

  it('should not be able to patch any state via an updater function', () => {
    const store = new Store();

    patchState(store, (value) => ({
      firstname: value.firstname,
      surname: value.surname,
    }));

    // @ts-expect-error not patchable
    patchState(store, (value) => ({ id: value.id }));
    // @ts-expect-error not patchable
    patchState(store, (value) => ({ birthday: value.birthday }));
  });
});
