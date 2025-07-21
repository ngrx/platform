import { computed } from '@angular/core';
import { DeepSignal, toDeepSignal } from './deep-signal';

/**
 * Creates a deep computed signal from the provided computation function.
 *
 * @param computation - The function to compute the signal value.
 * @returns A deep signal containing the computed value.
 *
 * @public
 */
export function deepComputed<T extends object>(
  computation: () => T
): DeepSignal<T> {
  return toDeepSignal(computed(computation));
}
