import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('withLinkedState', () => {
  const expectSnippet = expecter(
    (code) => `
        import { computed, inject, linkedSignal, Signal, signal } from '@angular/core';
        import {
          patchState,
          signalStore,
          withState,
          withLinkedState,
          withMethods
        } from '@ngrx/signals';

        ${code}
      `,
    compilerOptions()
  );

  it('does not have access to methods', () => {
    const snippet = `
      signalStore(
        withMethods(() => ({
          foo: () => 'bar',
        })),
        withLinkedState(({ foo }) => ({ value: foo() }))
      );
      `;

    expectSnippet(snippet).toFail(/Property 'foo' does not exist on type '{}'/);
  });

  it('does not have access to STATE_SOURCE', () => {
    const snippet = `
      signalStore(
        withState({ foo: 'bar' }),
        withLinkedState((store) => {
          patchState(store, { foo: 'baz' });
          return { bar: 'foo' };
        })
      )
      `;

    expectSnippet(snippet).toFail(
      /is not assignable to parameter of type 'WritableStateSource<object>'./
    );
  });

  it('cannot return a primitive value', () => {
    const snippet = `
      signalStore(
        withLinkedState(() => ({ foo: 'bar' }))
      )
      `;

    expectSnippet(snippet).toFail(
      /Type 'string' is not assignable to type 'WritableSignal<unknown> | (() => unknown)'./
    );
  });

  it('adds state slice with computation function', () => {
    const snippet = `
      const UserStore = signalStore(
        { providedIn: 'root' },
        withLinkedState(() => ({ firstname: () => 'John', lastname: () => 'Doe' }))
      );

      const userStore = new UserStore();

      const firstname = userStore.firstname;
      const lastname = userStore.lastname;
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer('firstname', 'Signal<string>');
    expectSnippet(snippet).toInfer('lastname', 'Signal<string>');
  });

  it('adds state slice with explicit linkedSignal', () => {
    const snippet = `
      const UserStore = signalStore(
        { providedIn: 'root' },
        withLinkedState(() => ({
          firstname: linkedSignal(() => 'John'),
          lastname: linkedSignal(() => 'Doe')
        }))
      );

      const userStore = new UserStore();

      const firstname = userStore.firstname;
      const lastname = userStore.lastname;
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer('firstname', 'Signal<string>');
    expectSnippet(snippet).toInfer('lastname', 'Signal<string>');
  });

  it('creates deep signals with computation functions', () => {
    const snippet = `
      const UserStore = signalStore(
        { providedIn: 'root' },
        withLinkedState(() => ({
          user: () => ({ id: 1, name: 'John Doe' }),
          location: () => ({ city: 'Berlin', country: 'Germany' }),
        }))
      );

      const userStore = new UserStore();

      const location = userStore.location;
      const user = userStore.user;
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'location',
      'DeepSignal<{ city: string; country: string; }>'
    );
    expectSnippet(snippet).toInfer(
      'user',
      'DeepSignal<{ id: number; name: string; }>'
    );
  });

  it('creates deep signals with explicit linked signals', () => {
    const snippet = `
      const UserStore = signalStore(
        { providedIn: 'root' },
        withLinkedState(() => ({
          user: linkedSignal(() => ({ id: 1, name: 'John Doe' })),
          location: linkedSignal(() => ({ city: 'Berlin', country: 'Germany' })),
        }))
      );

      const userStore = new UserStore();

      const location = userStore.location;
      const user = userStore.user;
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer(
      'location',
      'DeepSignal<{ city: string; country: string; }>'
    );
    expectSnippet(snippet).toInfer(
      'user',
      'DeepSignal<{ id: number; name: string; }>'
    );
  });

  it('infers the types for a mixed setting', () => {
    const snippet = `
      const Store = signalStore(
        withState({ foo: 'bar' }),
        withLinkedState(({ foo }) => ({
          bar: () => foo(),
          baz: linkedSignal(() => foo()),
          qux: signal({ x: 1 }),
        }))
      );

      const store = new Store();

      const bar = store.bar;
      const baz = store.baz;
      const qux = store.qux;
    `;

    expectSnippet(snippet).toSucceed();

    expectSnippet(snippet).toInfer('bar', 'Signal<string>');
    expectSnippet(snippet).toInfer('baz', 'Signal<string>');
    expectSnippet(snippet).toInfer('qux', 'DeepSignal<{ x: number; }>');
  });
});
