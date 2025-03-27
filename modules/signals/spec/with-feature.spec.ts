import {
  computed,
  inject,
  Injectable,
  ResourceStatus,
  Signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { tapResponse } from '@ngrx/operators';
import { lastValueFrom, Observable, of, pipe, switchMap, tap } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { EntityState, setAllEntities, withEntities } from '../entities';
import { rxMethod } from '../rxjs-interop';
import {
  getState,
  patchState,
  signalStore,
  signalStoreFeature,
  type,
  withComputed,
  withFeature,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '../src';

type User = {
  id: number;
  name: string;
};

describe('withFeature', () => {
  it('provides methods', async () => {
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

  it('provides state signals', async () => {
    const withDouble = (n: Signal<number>) =>
      signalStoreFeature(
        withComputed((state) => ({ double: computed(() => n() * 2) }))
      );

    const Store = signalStore(
      { providedIn: 'root' },
      withState({ counter: 1 }),
      withMethods((store) => ({
        increaseCounter() {
          patchState(store, ({ counter }) => ({ counter: counter + 1 }));
        },
      })),
      withFeature(({ counter }) => withDouble(counter))
    );

    const store = TestBed.inject(Store);

    expect(store.double()).toBe(2);
    store.increaseCounter();
    expect(store.double()).toBe(4);
  });

  it('provides properties', () => {
    @Injectable({ providedIn: 'root' })
    class Config {
      baseUrl = 'https://www.ngrx.io';
    }
    const withUrlizer = (baseUrl: string) =>
      signalStoreFeature(
        withMethods(() => ({
          createUrl: (path: string) =>
            `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`,
        }))
      );

    const Store = signalStore(
      { providedIn: 'root' },
      withProps(() => ({
        _config: inject(Config),
      })),
      withFeature((store) => withUrlizer(store._config.baseUrl))
    );

    const store = TestBed.inject(Store);
    expect(store.createUrl('docs')).toBe('https://www.ngrx.io/docs');
  });

  it('can be cominbed with inputs', () => {
    function withLoadEntities<Entity extends { id: number }, Filter>(config: {
      filter: Signal<Filter>;
      loader: (filter: Filter) => Observable<Entity[]>;
    }) {
      return signalStoreFeature(
        type<{ state: EntityState<Entity> & { status: ResourceStatus } }>(),
        withMethods((store) => ({
          _loadEntities: rxMethod<Filter>(
            pipe(
              tap(() => patchState(store, { status: ResourceStatus.Loading })),
              switchMap((filter) =>
                config.loader(filter).pipe(
                  tapResponse({
                    next: (entities) =>
                      patchState(
                        store,
                        { status: ResourceStatus.Resolved },
                        setAllEntities(entities)
                      ),
                    error: () =>
                      patchState(store, { status: ResourceStatus.Error }),
                  })
                )
              )
            )
          ),
        })),
        withHooks({
          onInit: ({ _loadEntities }) => _loadEntities(config.filter),
        })
      );
    }

    const Store = signalStore(
      { providedIn: 'root' },
      withEntities<User>(),
      withState({ filter: { name: '' }, status: ResourceStatus.Idle }),
      withMethods((store) => ({
        setFilter(name: string) {
          patchState(store, { filter: { name } });
        },
        _load(filters: { name: string }) {
          return of(
            [{ id: 1, name: 'Konrad' }].filter((person) =>
              person.name.startsWith(filters.name)
            )
          );
        },
      })),
      withFeature((store) =>
        withLoadEntities({ filter: store.filter, loader: store._load })
      )
    );

    const store = TestBed.inject(Store);

    expect(store.entities()).toEqual([]);
    store.setFilter('K');
    TestBed.flushEffects();
    expect(store.entities()).toEqual([{ id: 1, name: 'Konrad' }]);
    store.setFilter('Sabine');
    TestBed.flushEffects();
    expect(store.entities()).toEqual([]);
  });
});
