import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';
import { signalStore, withComputed } from 'modules/signals/src';
import { TestBed } from '@angular/core/testing';

describe('withComputed', () => {
  const expectSnippet = expecter(
    (code) => `
        import {
          deepComputed,
          signalStore,
          withComputed,
        } from '@ngrx/signals';
        import { TestBed } from '@angular/core/testing';
        import { signal } from '@angular/core';
        
        ${code}
      `,
    compilerOptions()
  );

  it('creates a Signal automtically', () => {
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
