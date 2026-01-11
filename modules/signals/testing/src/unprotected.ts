import {
  isWritableStateSource,
  Prettify,
  StateSource,
  WritableStateSource,
} from '@ngrx/signals';

type UnprotectedSource<Source extends StateSource<object>> =
  Source extends StateSource<infer State>
    ? Prettify<
        Omit<Source, keyof StateSource<State>> & WritableStateSource<State>
      >
    : never;

/**
 * @description
 *
 * Allows updating the protected state of a SignalStore for testing purposes.
 *
 * @usageNotes
 *
 * ```ts
 * import { TestBed } from '@angular/core/testing';
 * import { signalStore, withState, withComputed } from '@ngrx/signals';
 * import { unprotected } from '@ngrx/signals/testing';
 *
 * const UserStore = signalStore(
 *   { providedIn: 'root' },
 *   withState({ firstName: 'Eric', lastName: 'Clapton' }),
 *   withComputed(({ firstName, lastName }) => ({
 *     fullName: () => `${firstName()} ${lastName()}`,
 *   }))
 * );
 *
 * describe('UserStore', () => {
 *   it('recomputes fullName on firstName changes', () => {
 *     const userStore = TestBed.inject(UserStore);
 *
 *     patchState(unprotected(userStore), { firstName: 'Patrick' });
 *     expect(userStore.fullName()).toBe('Patrick Clapton');
 *   });
 * });
 * ```
 */
export function unprotected<Source extends StateSource<object>>(
  source: Source
): UnprotectedSource<Source> {
  if (isWritableStateSource(source)) {
    return source as UnprotectedSource<Source>;
  }

  throw new Error('@ngrx/signals: The provided source is not writable.');
}
