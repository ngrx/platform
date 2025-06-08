import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('signalStore', () => {
  const expectSnippet = expecter(
    (code) => `
        import { computed, inject, resource, Resource, Signal, signal } from '@angular/core';
        import {
          patchState,
          mapToResource,
          signalStore,
          withResource,
          withState
        } from '@ngrx/signals';

        ${code}
      `,
    compilerOptions()
  );

  describe('unnamed resource', () => {
    it('satisfies the Resource interface without default value', () => {
      const snippet = `
      const Store = signalStore(
        withResource(() => resource({loader: () => Promise.resolve(1)})) 
      );

      const store: Resource<number | undefined> = new Store();
    `;

      expectSnippet(snippet).toSucceed();
    });

    it('satisfies the Resource interface with default value', () => {
      const snippet = `
      const Store = signalStore(
        withResource(() => resource({loader: () => Promise.resolve(1), defaultValue: 0})) 
      );

      const store: Resource<number> = new Store();
    `;

      expectSnippet(snippet).toSucceed();
    });

    it('provides hasValue as type predicate when explicitly typed', () => {
      const snippet = `
      const Store = signalStore(
        withResource(() => resource({ loader: () => Promise.resolve(1) }))
      );

      const store: Resource<number | undefined> = new Store();
      if (store.hasValue()) {
        const value: number = store.value();
      }
    `;

      expectSnippet(snippet).toSucceed();
    });

    it('fails on hasValue as type predicate when not explicitly typed', () => {
      const snippet = `
      const Store = signalStore(
        withResource(() => resource({ loader: () => Promise.resolve(1) }))
      );

      const store = new Store();
      if (store.hasValue()) {
        const value: number = store.value();
      }
    `;

      expectSnippet(snippet).toFail(
        /Type 'number | undefined' is not assignable to type 'number'/
      );
    });

    it('does not have access to the STATE_SOURCE', () => {
      const snippet = `
          const Store = signalStore(
            withState({ id: 1 }),
            withResource((store) =>
              resource({
                params: store.id,
                loader: ({ params: id }) => {
                  patchState(store, { id: 0 });
                  return Promise.resolve(id + 1);
                },
              })
            )
          );
        `;

      expectSnippet(snippet).toFail(/Property '\[STATE_SOURCE\]' is missing/);
    });
  });

  describe('named resources', () => {
    it('does not have access to the STATE_SOURCE', () => {
      const snippet = `
        const Store = signalStore(
          withState({ id: 1 }),
          withResource((store) => ({
            user: resource({
              params: store.id,
              loader: ({ params: id }) => {
                patchState(store, { id: 0 });
                return Promise.resolve(id + 1);
              },
            }),
          }))
        );
        `;

      expectSnippet(snippet).toFail(/Property '\[STATE_SOURCE\]' is missing/);
    });
  });

  it('shoud allow different resource types with named resources', () => {
    const snippet = `
      const Store = signalStore(
        withResource((store) => ({
          id: resource({
            loader: () => Promise.resolve(1),
            defaultValue: 0,
          }),
          word: resource({
            loader: () => Promise.resolve('hello'),
            defaultValue: '',
          }),
          optionalId: resource({
            loader: () => Promise.resolve(1),
          })
        }))
      );
      const store = new Store();
      const id = store.idValue;
      const word = store.wordValue;
      const optionalId = store.optionalIdValue;
    `;

    expectSnippet(snippet).toInfer('id', 'Signal<number>');
    expectSnippet(snippet).toInfer('word', 'Signal<string>');
    expectSnippet(snippet).toInfer('optionalId', 'Signal<number | undefined>');
  });

  describe('mapToResource', () => {
    it('satisfies the Resource interface without default value', () => {
      const snippet = `
        const Store = signalStore(
          withResource(() => ({ id: resource({ loader: () => Promise.resolve(1) }) }))
        );

        const store = new Store();
        mapToResource(store, 'id') satisfies Resource<number | undefined>;
      `;

      expectSnippet(snippet).toSucceed();
    });

    it('satisfies the Resource interface with default value', () => {
      const snippet = `
        const Store = signalStore(
          withResource(() => ({
            id: resource({
              loader: () => Promise.resolve(1),
              defaultValue: 0
            })
          }))
        );

        const store = new Store();
        mapToResource(store, 'id') satisfies Resource<number | undefined>;
      `;

      expectSnippet(snippet).toSucceed();
    });

    it('provides hasValue as type predicate', () => {
      const snippet = `
      const Store = signalStore(
        withResource(() => ({id: resource({ loader: () => Promise.resolve(1) })}))
      );

      const store = new Store();
      const res = mapToResource(store, 'id');
      if (res.hasValue()) {
        const value: number = res.value();
      }
    `;

      expectSnippet(snippet).toSucceed();
    });

    describe('resource name checks', () => {
      const setupStore = `
        const Store = signalStore(
          withState({ key: 1, work: 'test' }),
          withResource(() => ({
            id: resource({ loader: () => Promise.resolve(1) }),
            word: resource({ loader: () => Promise.resolve('hello') })
          }))
        );

        const store = new Store();
      `;

      it('allows passing id as a valid resource name', () => {
        const snippet = `
          ${setupStore}
          mapToResource(store, 'id');
        `;

        expectSnippet(snippet).toSucceed();
      });

      it('allows passing word as a valid resource name', () => {
        const snippet = `
          ${setupStore}
          mapToResource(store, 'word');
        `;

        expectSnippet(snippet).toSucceed();
      });

      it('fails when passing key as a resource name', () => {
        const snippet = `
          ${setupStore}
          mapToResource(store, 'key');
        `;

        expectSnippet(snippet).toFail(
          /Argument of type '"key"' is not assignable to parameter of type '"id" | "word"/
        );
      });

      it('fails when passing work as a resource name', () => {
        const snippet = `
          ${setupStore}
          mapToResource(store, 'work');
        `;

        expectSnippet(snippet).toFail(
          /Argument of type '"work"' is not assignable to parameter of type '"id" | "word"/
        );
      });
    });

    it('fails when Resource properties are not fully defined', () => {
      const snippet = `
        const Store = signalStore(
          withState({ userValue: 0 })
        );

        const store = new Store();
        mapToResource(store, 'user');
      `;

      expectSnippet(snippet).toFail(
        /Argument of type '"user"' is not assignable to parameter of type 'never'/
      );
    });
  });
});
