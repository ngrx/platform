import {
  computed,
  isSignal,
  Signal as NgSignal,
  untracked,
} from '@angular/core';
import { IsUnknownRecord } from './ts-helpers';

// An extended Signal type that enables the correct typing
// of nested signals with the `name' or `length' key.
interface Signal<T> extends NgSignal<T> {
  name: unknown;
  length: unknown;
}

export type DeepSignal<T> = Signal<T> &
  (T extends Record<string, unknown>
    ? IsUnknownRecord<T> extends true
      ? unknown
      : Readonly<{
          [K in keyof T]: T[K] extends Record<string, unknown>
            ? IsUnknownRecord<T[K]> extends true
              ? Signal<T[K]>
              : DeepSignal<T[K]>
            : Signal<T[K]>;
        }>
    : unknown);

export function toDeepSignal<T>(signal: Signal<T>): DeepSignal<T> {
  const value = untracked(() => signal());
  if (!isRecord(value)) {
    return signal as DeepSignal<T>;
  }

  return new Proxy(signal, {
    get(target: any, prop) {
      if (!(prop in value)) {
        return target[prop];
      }

      if (!isSignal(target[prop])) {
        Object.defineProperty(target, prop, {
          value: computed(() => target()[prop]),
        });
      }

      return toDeepSignal(target[prop]);
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value?.constructor === Object;
}
