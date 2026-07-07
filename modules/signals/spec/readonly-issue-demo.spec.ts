import { expecter } from 'ts-snippet';
import { compilerOptions } from './types/helpers';

describe('signalStore readonly members', () => {
  const expectSnippet = expecter(
    (code) => `
      import { computed, signal, Signal } from '@angular/core';
      import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

      const UserStore = signalStore(
        withState<{ name: string; age: number }>({ name: 'Alice', age: 30 }),
        withComputed((store) => ({
          greeting: computed(() => 'Hi, ' + store.name()),
        })),
        withMethods((store) => ({
          setName(name: string) { patchState(store, { name }); },
        }))
      );

      const store = new UserStore();
      ${code}
    `,
    compilerOptions()
  );

  it('prevents reassigning state signals', () => {
    expectSnippet(`store.name = signal('x') as unknown as Signal<string>;`).toFail(/read-only/);
  });

  it('prevents reassigning computed signals', () => {
    expectSnippet(`store.greeting = signal('x') as unknown as Signal<string>;`).toFail(/read-only/);
  });

  it('prevents reassigning methods', () => {
    expectSnippet(`store.setName = (n: string) => {};`).toFail(/read-only/);
  });
});
