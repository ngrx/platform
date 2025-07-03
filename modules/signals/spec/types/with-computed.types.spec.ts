import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('withComputed', () => {
  const expectSnippet = expecter(
    (code) => `
        import {
          deepComputed,
          patchState,
          signalStore,
          withComputed,
          withMethods,
          withProps,
          withState,
        } from '@ngrx/signals';
        import { TestBed } from '@angular/core/testing';
        import { signal } from '@angular/core';
        
        ${code}
      `,
    compilerOptions()
  );

  it('has access to props, state signals and methods', () => {
    const snippet = `
      signalStore(
        withState({
          a: 1,
        }),
        withProps(() => {
          return {
            b: 2,
          };
        }),
        withMethods(({ a, b }) => ({
          sum: () => a() + b,
        })),
        withComputed(({ a, b, sum }) => ({
          prettySum: () => \`Sum: \${a()} + \${b} = \${sum()}\`,
        }))
      );
    `;

    expectSnippet(snippet).toSucceed();
  });

  it('has no access to the state', () => {
    const snippet = `
      signalStore(
        withState({
          a: 1,
        }),
        withComputed((store) => ({
          prettySum: () => {
            patchState(store, { a: 2 });
            return store.a();
          },
        }))
      );
    `;

    expectSnippet(snippet).toFail(
      /not assignable to parameter of type 'WritableStateSource<object>'/
    );
  });

  it('creates a Signal automatically', () => {
    const snippet = `
      const Store = signalStore(
        withComputed(() => ({
          user: () => ({ firstName: 'John', lastName: 'Doe' })
        }))
      );

      const store = TestBed.inject(Store);
      const user = store.user;
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer(
      'user',
      'Signal<{ firstName: string; lastName: string; }>'
    );
  });

  it('keeps a WritableSignal intact, if passed', () => {
    const snippet = `
      const user = signal({ firstName: 'John', lastName: 'Doe' });

      const Store = signalStore(
        withComputed(() => ({
          user,
        }))
      );

      const store = TestBed.inject(Store);
      const userSignal = store.user;
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer(
      'userSignal',
      'WritableSignal<{ firstName: string; lastName: string; }>'
    );
  });

  it('keeps a DeepSignal intact, if passed', () => {
    const snippet = `
    const user = deepComputed(
      signal({
        name: 'John Doe',
        address: {
          street: '123 Main St',
          city: 'Anytown',
        },
      })
    );

    const Store = signalStore(
      withComputed(() => ({
        user,
      }))
    );

    const store = TestBed.inject(Store);
    const userSignal = store.user;
  `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer(
      'userSignal',
      'DeepSignal<{ name: string; address: { street: string; city: string; }; }>'
    );
  });
});
