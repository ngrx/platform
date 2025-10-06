import { expecter } from 'ts-snippet';
import { compilerOptions } from './helpers';

describe('unprotected', () => {
  const expectSnippet = expecter(
    (code) => `
        import { computed, inject } from '@angular/core';
        import { signalStore, withState, withComputed } from '@ngrx/signals';
        import { unprotected } from '@ngrx/signals/testing';

        ${code}
      `,
    compilerOptions()
  );

  it('replaces StateSource with WritableStateSource', () => {
    const snippet = `
      const CounterStore = signalStore(
        withState({ count: 0 }),
        withComputed(({ count }) => ({
          doubleCount: computed(() => count() * 2),
        })),
      );

      const store = inject(CounterStore);
      const unprotectedStore = unprotected(store);
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer(
      'unprotectedStore',
      '{ count: Signal<number>; doubleCount: Signal<number>; [STATE_SOURCE]: { count: WritableSignal<number>; }; }'
    );
  });

  it('does not affect the store with an unprotected state', () => {
    const snippet = `
      const CounterStore = signalStore(
        { protectedState: false },
        withState({ count: 0 }),
      );

      const store = inject(CounterStore);
      const unprotectedStore = unprotected(store);
    `;

    expectSnippet(snippet).toSucceed();
    expectSnippet(snippet).toInfer(
      'unprotectedStore',
      '{ count: Signal<number>; [STATE_SOURCE]: { count: WritableSignal<number>; }; }'
    );
  });
});
