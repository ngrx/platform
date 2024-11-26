import { computed } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';

export function deepComputed<T extends object>(
  computation: () => T
): DeepSignal<T> {
  return toDeepSignal(computed(computation));
}
