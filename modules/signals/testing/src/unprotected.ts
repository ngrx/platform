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

export function unprotected<Source extends StateSource<object>>(
  source: Source
): UnprotectedSource<Source> {
  if (isWritableStateSource(source)) {
    return source as UnprotectedSource<Source>;
  }

  throw new Error('@ngrx/signals: The provided source is not writable.');
}
