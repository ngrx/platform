import { isSignal, Signal, untracked } from '@angular/core';
import { selectSignal } from './select-signal';

export type DeepSignal<T> = Signal<T> &
  (T extends Record<string, unknown>
    ? Readonly<{ [K in keyof T]: DeepSignal<T[K]> }>
    : unknown);

export function toDeepSignal<T>(signal: Signal<T>): DeepSignal<T> {
  const value = untracked(() => signal());
  if (!isRecord(value)) {
    return signal as DeepSignal<T>;
  }

  return new Proxy(signal, {
    get(target: any, prop) {
      if (prop in value && !target[prop]) {
        target[prop] = selectSignal(() => target()[prop]);
      }

      return isSignal(target[prop]) ? toDeepSignal(target[prop]) : target[prop];
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value?.constructor === Object;
}
