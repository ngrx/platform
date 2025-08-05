import { computed, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { setAllEntities, withEntities } from '../entities';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '../src';
import { withFeatureFactory } from '../src/with-feature-factory';

type Book = {
  id: string;
  name: string;
  author: string;
};

describe('withFeatureFactory', () => {
  it('should enable to create a feature that needs input data', () => {
    const withBooksFilter = withFeatureFactory((books: Signal<Book[]>) =>
      signalStoreFeature(
        withState({ query: '' }),
        withComputed((store) => ({
          filteredBooks: computed(() =>
            books().filter((b) => b.name.includes(store.query()))
          ),
        })),
        withMethods((store) => ({
          setQuery(query: string): void {
            patchState(store, { query });
          },
        }))
      )
    );

    expect(withBooksFilter).toBeDefined();
  });
  it('should not allow to pass several parameters to the custom feature', () => {
    let error = undefined;
    try {
      const withBooksFilter = withFeatureFactory(
        //@ts-expect-error withFeatureFactory accepts a function with only one parameter
        (books: Signal<Book[]>, arg2: boolean) =>
          signalStoreFeature(
            withState({ query: '' }),
            withComputed((store) => ({
              filteredBooks: computed(() =>
                books().filter((b) => b.name.includes(store.query()))
              ),
            })),
            withMethods((store) => ({
              setQuery(query: string): void {
                patchState(store, { query });
              },
            }))
          )
      );
    } catch (featureError) {
      error = featureError;
    }
    expect(error).toBeDefined();
  });
  it('wires the store (state, properties, methods) to the feature input correctly', () => {
    const withBooksFilter = withFeatureFactory((books: Signal<Book[]>) =>
      signalStoreFeature(
        withState({ query: '' }),
        withComputed((store) => ({
          filteredBooks: computed(() =>
            books().filter((b) => b.name.includes(store.query()))
          ),
        })),
        withMethods((store) => ({
          setQuery(query: string): void {
            patchState(store, { query });
          },
        }))
      )
    );

    const BooksStore = signalStore(
      withEntities<Book>(),
      withBooksFilter(({ entities }) => entities),
      withHooks((store) => ({
        onInit: () => {
          patchState(
            store,
            setAllEntities([
              { id: '1', name: 'Angular Basics', author: 'John Doe' },
              { id: '2', name: 'React Basics', author: 'Jane Doe' },
            ])
          );
        },
      }))
    );
    TestBed.configureTestingModule({
      providers: [BooksStore],
    });
    const store = TestBed.inject(BooksStore);

    expect(store.filteredBooks()).toEqual(store.entities());
    store.setQuery('Angular');
    const filteredBooks = store.filteredBooks();
    expect(filteredBooks).toEqual([
      { id: '1', name: 'Angular Basics', author: 'John Doe' },
    ]);
  });
});
