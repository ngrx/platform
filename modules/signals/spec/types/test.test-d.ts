import { patchState, signalState } from '@ngrx/signals';

/**
 * This test demonstrates that runtime execution does not
 * happen and therefore this test will succeed.
 *
 * That is because `@ts-expect-error` does not differentiate
 * between a type-only error and a syntax error.
 */

it('should fail', () => {
  const state = signalState({ foo: 'bar' });

  // @ts-expect-error foo is not a number
  patchStore(state, { foo: 1 });
});
