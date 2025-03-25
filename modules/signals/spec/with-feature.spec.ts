import { lastValueFrom, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { computed, Signal } from '@angular/core';
import {
  getState,
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withFeature,
  withMethods,
  withState,
} from '../src';

type User = {
  id: number;
  name: string;
};

function withMyEntity<Entity>(loadMethod: (id: number) => Promise<Entity>) {
  return signalStoreFeature(
    withState({
      currentId: 1 as number | undefined,
      entity: undefined as undefined | Entity,
    }),
    withMethods((store) => ({
      async load(id: number) {
        const entity = await loadMethod(1);
        patchState(store, { entity, currentId: id });
      },
    }))
  );
}

describe('withFeatureFactory', () => {
  it('should allow a sum feature', () => {
    function withSum(a: Signal<number>, b: Signal<number>) {
      return signalStoreFeature(
        withComputed(() => ({ sum: computed(() => a() + b()) }))
      );
    }
    signalStore(
      withState({ a: 1, b: 2 }),
      withFeature((store) => withSum(store.a, store.b))
    );
  });

  it('should allow to pass elements from a SignalStore to a feature', async () => {
    const UserStore = signalStore(
      { providedIn: 'root' },
      withMethods(() => ({
        findById(id: number) {
          return of({ id: 1, name: 'Konrad' });
        },
      })),
      withFeature((store) => {
        const loader = (id: number) => lastValueFrom(store.findById(id));
        return withMyEntity<User>(loader);
      })
    );

    const userStore = TestBed.inject(UserStore);
    await userStore.load(1);
    expect(getState(userStore)).toEqual({
      currentId: 1,
      entity: { id: 1, name: 'Konrad' },
    });
  });
});
